---
title: 微信小程序入门
comments: false
date: 2020-09-11 11:11:11
tags: [get started, WeChat, mini program]
---

还记得很多年前，那时候没有微信小程序，只有微信公众号（订阅号/服务号/企业号）。彼时，个人想要注册一个公众号，各种门槛，各种收费。作为一个本不富裕的铮铮男儿，为了省 **￥300/年** 的认证费，毅然决然的去学习其他的技术，并妄下断言：这种对大众开发者不友好的技术，注定走不长久！

少年糊涂啊！后来的现实疯狂打脸这位少年，并将这位少年的脸按在地上疯狂摩擦。

唉，往事如风，不堪回首！

然后，有一天，突发奇想，将现有的网页应用迁移至微信小程序究竟有多难？

容不得多想，说干就干！

*此处省略各种注册、配置环节* （网上有很多入门教程，微信官方也有，炒鸡简单）

如今注册环节简明了很多，注册个人小程序的话，还剩了认证费用。开心。

从一个 `Hello, World` 开始：

打开微信开发者工具，扫码登陆，新建小程序项目。

工具默认会添加一些示例代码，大家可按需增加/删除代码。此处我只是把简单的踩的坑罗列一下，已提供给各位少侠发现美的眼睛。

## table 组件

微信小程序默认支持的组件有限，但是 `table` 在日常 web 开发，特别是办公场景中，使用的超级广泛。网上也有很多的第三方插件，都不太满意。虽说众多前端页面优化文章都推荐说尽量减少 `table` 的使用，以减少重绘及重排导致的性能开销，但是图表可是办公类应用使用最广泛的控件类型之一。

考虑到微信小程序的 `wxss` 其实就是 `css`（除了多了 `rpx` 这一个单位），所以，其实可以将小程序中的 `view` (同 `div`) 设置成 `display:table`。

## 发布

微信开发者工具集成发布功能，一键点击即可发布。此处不过多赘述了。

## 2020.10.29 更新

哈哈，阮一峰终于也 [染指微信小程序](http://www.ruanyifeng.com/blog/2020/10/wechat-miniprogram-tutorial-part-one.html) 了，大家快去观摩啊~ 😄

## 参考链接 ##

1. [微信官方文档·小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/)
2. [教程|《小程序开发指南》](https://developers.weixin.qq.com/ebook?action=get_post_info&docid=0008aeea9a8978ab0086a685851c0a&pass_ticket=X5FAAzGjV66sjEQ5vheOV8ZXQBv0LFA5jBNu9mm48OC3JJsyPNTBhka1%2FWfj%2BZ6Y)