---
title: SQL Server 中的 GROUP_CONCAT
tags:
  - GROUP_CONCAT
  - SQL Server
  - STRING_AGG
  - STUFF FOR XML PATH
comments: false
date: 2021-02-28 16:12:14
---

在日常数据库编程中，分组，以及将分组中每个元素拼接，是非常常见的操作。MySQL 中只需要使用 [GROUP_CONCAT](https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html#function_group-concat) 函数即可。而在 SQL Server 中，如果 SQL Server 版本大于等于 2017，则可以使用 [STRING_AGG](https://docs.microsoft.com/en-us/sql/t-sql/functions/string-agg-transact-sql?view=sql-server-ver15) 函数。如果 SQL Server 版本小于 2017 的话，则稍微负责一点。

遗憾的是，目前大多数企业，使用的 SQL Server 都不高于 2017，甚至，有些还在用 SQL Server 2008 R2，甚至是 2000！😟

那么，如果在不支持 STRING_AGG 的低版本 SQL Server 中，如何才能把每个分组中的字段拼接起来？一般来说，使用 STUFF FOR XML PATH 语法就可以了。

以下是范例：

``` sql
SELECT
  m.maskid
  ,m.maskname
  ,m.schoolid
  ,s.schoolname
  ,maskdetail = STUFF(
    (SELECT ',' + md.maskdetail FROM dbo.maskdetails md WHERE m.maskid = md.maskid FOR XML PATH(''), TYPE)
    .value('.', 'NVARCHAR(MAX)'), 1, 1, '')
FROM dbo.tblmask m
JOIN dbo.school s ON s.ID = m.schoolid
ORDER BY m.maskname
```
### 参考链接

- [How to make a query with group_concat in sql server](https://stackoverflow.com/questions/17591490/how-to-make-a-query-with-group-concat-in-sql-server)
- [USE STUFF AND ‘FOR XML PATH’ IN SQL SERVER TO CONCATENATE STRING](https://codemegeek.com/2018/11/17/use-stuff-and-for-xml-path-in-sql-server-to-concatenate-string/)
