---
title: Angular 应用国际化
comments: false
date: 2020-07-01 11:19:55
tags: [Angular, internationalization, i18n]
---


如何 Angular i18n，不做过多赘述，有任何问题，请移步 [官网](https://angular.cn/guide/i18n)。

## 背景

当前端页面有大批量更新，`trans-unit` 有大幅变动(新增、更改 `context-group` 或删除等等)时，如果人工手动去调整，工作量大不说，很容易出错。所以必须想办法去自动更新。

## 我的解决方案

在没有去搜索引擎找寻方案的前提下，下面是自己写的 C# 控制台项目：

1. 备份当前 `messages.zh.xlf` 文件。
2. 新建 C# 控制台项目，复制 [此 gist](https://gitee.com/nextwave/codes/svcegrhbnxd82a7pkijlw10) 代码。
3. 复制 `messages.zh.xlf` 到当前项目的根目录，并重命名未 `history.xlf`。
4. 运行命令 `ng xi18n --output-path locale` 重新生成新的 `messages.xlf` 文件。
5. 复制 `messages.xlf` 到当前项目的根目录，并重命名未 `now.xlf`。
6. 将 `history.xlf` 和 `now.xlf` 文件设置成 copy always。
7. 运行项目，得到 `output.xlf`（位于项目根目录/bin/Debug）。
8. 复制 `messages.xlf` 到 Angular 的 `locale` 文件夹，并重命名未 `messages.zh.xlf`。
9. 打开 `messages.zh.xlf`，找到所有后面不是 `target` 节点的 `source` 节点 （很多 IDE 支持正则或者换行符查找）。
10. 补全 `target` 节点

当当当当，新鲜的 `message.zh.xlf` 出炉啦！
