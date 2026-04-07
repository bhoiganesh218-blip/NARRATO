self.addEventListener("install", (event) => {
  self.skipWaiting(); // force activate
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim()); // control pages
});

self.addEventListener("fetch", () => {});