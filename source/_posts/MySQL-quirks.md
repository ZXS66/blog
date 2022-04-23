---
title: MySQL怪癖
tags:
  - mysql
  - if statement
  - sleep
comments: false
date: 2022-03-31 11:03:50
---

### MySQL 即时查询窗口不支持 IF 表达式

对于我这个菜鸡来说，虽然听起来很不可思议，但这是真的，你没（mèi）听错。根据 MySQL [官方文档](https://dev.mysql.com/doc/refman/8.0/en/if.html)，IF 表达式仅可以在存储程序（存储过程或函数）中适用（除此之外，还有一个 [IF 函数](https://dev.mysql.com/doc/refman/8.0/en/flow-control-functions.html#function_if)），即时查询窗口中用不了！早在 2008 年就有大佬报怨 [<fa-link/>](https://www.bennadel.com/blog/1340-mysql-does-not-support-if-else-statements-in-general-sql-work-flow.htm)，都 2022 年了，这个问题还没有解决，也不知道 MySQL 团队是咋想的。

BTW，[Oracle 开发工程师离职后怒喷 MySQL 很烂](https://www.theregister.com/2021/12/06/mysql_a_pretty_poor_database/) 这条新闻，去年就上了热搜，说起来确实是个笑话。

### MySQL 中 SLEEP 方法

基于 [MySQL SLEEP 命令官方文档](https://dev.mysql.com/doc/refman/8.0/en/miscellaneous-functions.html#function_sleep)，推荐用法是 `SELECT SLEEP(1)`。但是，如果这样书写方式，会给存储过程的既定输出造成影响。 

通过面向搜索引擎编程，发现以下脚本居然可行？

``` sql
-- SELECT ...
DO SLEEP(5);
-- SELECT ...
```

### MySQL 中 PRINT 方法

MySQL 中暂无此方法！如果有大佬知道，请告诉我，不胜感激！

### 一个范例

``` sql
DELIMITER $$
USE `media`$$
DROP PROCEDURE IF EXISTS `sp_news_query_with_safe_check`$$
CREATE DEFINER=`media_user`@`%` PROCEDURE `sp_news_query_with_safe_check`(IN `batch_no` VARCHAR(128),IN `order_no` VARCHAR(45))
    COMMENT 'query news by order_no and batch_no, with safe check (if the data insertion completed)'
proc_label:BEGIN
		
		DECLARE lastRowID INT;
		DECLARE newRowID INT;
		DECLARE lastOrderNO VARCHAR(45);
		DECLARE lastBatchNO VARCHAR(128);
		SELECT MAX(t.id) INTO lastRowID FROM `news` t;
		SELECT t.order_no INTO lastOrderNO FROM `news` t WHERE id=lastRowID;
		SELECT t.batch_no INTO lastBatchNO FROM `news` t WHERE id=lastRowID;
		
		-- SELECT lastRowID, lastOrderNO, lastBatchNO;
		
		-- safe check (if the data insertion completed)
		IF lastOrderNO=`order_no` AND lastBatchNO=`batch_no` THEN
			-- the lastest row's order_no and batch_no are equal to the querying request form
			-- wait for 4 seconds to see if any new rows inserted
			-- if yes, the insertion is happening and just exit the query
			-- if no, continue the query
			DO SLEEP(4);
			SELECT MAX(t.id) INTO newRowID FROM `news` t;
			IF newRowID!=lastRowID THEN LEAVE proc_label; END IF;
		END IF;

		SELECT DISTINCT 
			n.*
		FROM news n 
		INNER JOIN requestform r ON n.batch_no=r.batch_no AND n.order_no=r.order_no
		WHERE n.batch_no=`batch_no` AND n.order_no=`order_no` AND (n.pub_date BETWEEN r.start_pub_date AND r.end_pub_date);
	END$$
DELIMITER ;
```

### 支持 Emoji 字符

首先，MySQL 是支持 Emoji 字符的，但是，也不完全支持，即使编码设置的是 `utf8mb4`。

这里就不展开了，更多可以查看我的 [另一篇文章](/2022/04/07/mysql-charset-issue/)。

### 参考链接

- [MySQL::Miscellaneous Functions::Sleep](https://dev.mysql.com/doc/refman/8.0/en/miscellaneous-functions.html#function_sleep)
- [<i class="fa fa-stack-overflow" aria-hidden="true"></i> How and when to use SLEEP() correctly in MySQL?](https://stackoverflow.com/questions/4284524/how-and-when-to-use-sleep-correctly-in-mysql)
- [<i class="fa fa-weixin" aria-hidden="true"></i> Oracle大佬离职，怒喷MySQL是“糟糕的数据库”……](https://mp.weixin.qq.com/s/zajIrjPAJPYnBzrqyU0U4Q)
