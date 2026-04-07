const CACHE_NAME = "narrato-v1";
const ASSETS = [
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./Script/auth.js",
  "./Script/app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Install Event: Files ko cache mein save karna
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event: Purane cache ko delete karna
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Offline hone par cache se file dena
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
