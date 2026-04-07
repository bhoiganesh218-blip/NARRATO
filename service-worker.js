const CACHE_NAME = "narrato-cache-v1";
const urlsToCache = [
  "/NARRATO/",
  "/NARRATO/index.html",
  "/NARRATO/style.css",
  "/NARRATO/Script/app.js"
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    clients.claim()
  );
});

// FETCH (IMPORTANT)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});