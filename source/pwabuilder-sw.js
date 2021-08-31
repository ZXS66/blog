// // This is the service worker with the Cache-first network
// const CACHE = "pwabuilder-precache";
// importScripts(
//   "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
// );
// self.addEventListener("message", event => {
//   if (event.data && event.data.type === "SKIP_WAITING") {
//     self.skipWaiting();
//   }
// });
// workbox.routing.registerRoute(
//   new RegExp("/*"),
//   new workbox.strategies.CacheFirst({
//     cacheName: CACHE
//   })
// );

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
