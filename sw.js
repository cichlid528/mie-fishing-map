const VERSION = "v176-spot-species-picker-fix";
self.addEventListener("install", (event) => { self.skipWaiting(); });
self.addEventListener("activate", (event) => { event.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", (event) => { event.respondWith(fetch(event.request)); });
