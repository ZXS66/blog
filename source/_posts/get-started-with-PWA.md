---
title: 渐进式网页应用(PWA)入门
tags:
  - PWA
  - Progressive Web App
  - get started
comments: false
date: 2021-05-06 12:54:15
---

`PWA` 现在越来越流行了。虽然国内见得不多，但国外已经非常常见了。闲来无事，那就把本博客改造成 `PWA` 好了。

### PWA 介绍

此处省略一万字。[<fa-link/>](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

### 起步

参考的是 [这篇文档](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/get-started)。~~此处又省略了一万字。~~

### 一个小 bug

`@pwabuilder/pwaupdate` 组件 [默认](https://github.com/pwa-builder/pwa-update#api) 加载的 `service worker` 是**当前路径**下的 "pwabuilder-sw.js" 文件。可是，当路径变了，比如跳到了更深一层目录，`service worker` 就不能正常加载了。解决办法是在注册 `service worker` 时（执行 `pwabuilder-sw-register.js` 文件），指定 `swpath` 为 "`/pwabuilder-sw.js`"。

``` js
import "https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate";
const el = document.createElement("pwa-update");
// default is "pwabuilder-sw.js", but it doesn't work in subpaths
el.setAttribute("swpath", "/pwabuilder-sw.js");
document.body.appendChild(el);
```

### 强制更新

上线后一段时间发现，`PWA` 是可以正常工作了，也能离线使用，但是因为使用的是 `Cache-First` 策略，所以会发生服务器端其实已经更新了，但是本地一直看不到最新版本。PC 端还好，可以使用强制刷新 (`Ctrl`+`Shift`+`R`或者`Ctrl`+`Shift`+`F5`组合键或者长按刷新按钮)来查看最新版本，手机端怎么办。手机浏览器又没有强制刷新功能。

上网搜寻解决方案，发现我并不是一个人，很多人有这个痛点！！emmm，`PWA` 还是有提升空间的，至少我相信，使用 `Cache-First` 策略的人，90% 都是希望默认打开本地版本（以提升速度），在设备联网的时候，有更新就更新版本，这次/下次刷新直接用，没更新就接着用本地缓存版。

参考 [这篇问答](https://stackoverflow.com/questions/49739438/when-and-how-does-a-pwa-update-itself)，解决办法有两个：

1. 更新 `mainfest.json` 文件
2. 更新 `service worker` 文件

好像，这两个办法也不太适合此 PWA，因为我这是个博客网站，平时变动的最多的是博客文章本身，我才没必要每次发文时去改动博客网站。所以，还得另想办法。

回到问题本身。既然，`Cache-First` 策略本身有问题，那我换个策略可还行？参考 [PWA Builder](https://www.pwabuilder.com/)，我把策略改成 `Stale-While-Revalidate`。`pwabuilder-sw.js` 内容如下：

``` js

// This is the "Offline copy of assets" service worker
const CACHE = "pwabuilder-offline";
const QUEUE_NAME = "bgSyncQueue";
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin(
  QUEUE_NAME,
  // { maxRetentionTime: 24 * 60 } // Retry for max of 24 Hours (specified in minutes)
  // { maxRetentionTime: 7 * 24 * 60 } // Retry for max of 1 week (specified in minutes)
);
workbox.routing.registerRoute(
  new RegExp("/*"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE,
    plugins: [bgSyncPlugin]
  })
);
```

更多策略，请参考 [<i class="fa fa-google" aria-hidden="true"></i> Workbox 官方文档](https://developers.google.com/web/tools/workbox/modules/workbox-strategies) 和 [<i class="fa fa-github" aria-hidden="true"></i> GoogleChrome/workbox](https://github.com/googlechrome/workbox)。

发布上线，测试，完美解决问题！😄

### 参考链接

- [Get started with Progressive Web Apps (Chromium)](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/get-started)
- [When and how does a PWA update itself?](https://stackoverflow.com/questions/49739438/when-and-how-does-a-pwa-update-itself)
- [PWA Builder](https://www.pwabuilder.com/)
- [<i class="fa fa-google" aria-hidden="true"></i> Workbox 官方文档](https://developers.google.com/web/tools/workbox/modules/workbox-strategies)
- [<i class="fa fa-github" aria-hidden="true"></i> GoogleChrome/workbox](https://github.com/googlechrome/workbox)
