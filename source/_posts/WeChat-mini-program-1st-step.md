---
title: 微信小程序开发入门篇
tags:
  - WeChat
  - mini program
  - 微信
  - 小程序
comments: false
date: 2021-06-20 23:26:00
---

距离 [上次接触小程序](/2021/09/11/get-started-with-WeChat-mini-program/) 已经过去大半年了，期间一直没有更新。实在是太懒了。正好这个周末有空，就自己瞎鼓捣一下好了。

说干就干！

安装及环境初始化，这里就略过了。官方已经提供了很详细的 [101 教程](https://developers.weixin.qq.com/miniprogram/dev/framework/MINA.html)。

### 注意事项

1. 自 2021/4/13 起，微信旧 API [wx.getUserInfo](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html) 不再弹出弹窗，并直接返回匿名的用户个人信息，取而代之的是 [wx.getUserProfile](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html)，详细参考 [小程序官方公告](https://developers.weixin.qq.com/community/develop/doc/000cacfa20ce88df04cb468bc52801)；
2. 小程序端的 [数据缓存 API](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorage.html)：
   - 不能使用类似 `wx.setStorage(key, value)` 和 `wx.getStorage(key)` 的形式存取数据，取而代之的是 `wx.setStorage({ key:"key", data:"value"})` 和 `wx.getStorage({ key:"key"})`（注意，是 `data` 而不是 `value` 哦）；
   - 虽然官方文档说 `success`、`fail`、`complete` 三个回调函数都不是必填项，但是代码中很容易因为没有指定 `fail` 回调导致报错，所以推荐后两者中任意指定的一个。
3. 云开发免费版提供了不超过 2GB 的数据库容量以及每天不超过 500 次读操作，这对个人开发者或者企业 POC （Proof of Concept）非常友好。如果为了保险起见，那 6.9 元/月特惠基础版套餐应该够你做原型验证了。（我没有在打广告 😂）收费项目如下，详细内容请参考 [官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/billing/quota.html):
   | 分类·参数 | 免费版套餐 | 6.9元/月特惠基础版套餐 |
   |------|------|------|
   |存储·容量|5GB|8GB|
   |存储·下载操作次数|2000/月|10万/月|
   |存储·上传操作次数|1000/月|5万/月|
   |存储·CDN回源流量 [注](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/billing/quota.html#quota_footnote_cdn_origin)|1GB/月|2GB/月|
   |CDN·CDN流量 [注](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/billing/quota.html#quota_footnote_cdn)|1GB/月|2GB/月|
   |云函数·资源使用量GBs [注](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/billing/quota.html#quota_footnote_gbs)|1000/月|1万/月|
   |云函数·外网出流量|1GB/月|1GB/月|
   |云函数·云函数数量|10个|50个|
   |数据库·容量|2GB|5GB|
   |数据库·同时连接数 [注](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/billing/quota.html#quota_footnote_db)|5|20|
   |数据库·读操作数|500/天|5万/天|
   |数据库·写操作数|300/天|3万/天|
   |数据库·集合限制|15个|50个|
4. 官方 WeUI 组件库扩展了小程序原生组件。虽然还是明显不够用，但总比没有强。比如 [mp-icon](https://developers.weixin.qq.com/miniprogram/dev/extended/weui/icon.html) 就省的我们去搜寻或者设计基础图标了。

### 云开发

现在创建微信小程序项目，默认开启云开发选项，方便大家快速部署原型。

*未完待续*

### 预览

![时代残党小程序](/images/WeChat-mini-program-1st-step/gh_d8e358fd13d3_258.jpg)

### 参考链接

- [微信官方文档·小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/)
