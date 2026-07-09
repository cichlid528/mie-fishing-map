const VERSION = "v172-spot-checklist-restore";
self.addEventListener("install", (event) => { self.skipWaiting(); });
self.addEventListener("activate", (event) => { event.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", (event) => { event.respondWith(fetch(event.request)); });
