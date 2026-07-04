const CACHE_NAME = "bass-spot-log-v42";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css?v=42",
  "./app.js?v=42",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

function isAppShellRequest(requestUrl, request) {
  if (request.mode === "navigate") return true;
  const path = requestUrl.pathname.split("/").pop() || "index.html";
  return ["", "index.html", "app.js", "style.css", "sw.js", "manifest.json"].includes(path);
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  const scopeUrl = new URL(self.registration.scope);

  // 地図タイル・地名タイルなどの外部データはキャッシュしません。
  // スマホで大量キャッシュすると、地図操作のカクつきや古い位置補正の原因になります。
  if (requestUrl.origin !== scopeUrl.origin) {
    event.respondWith(fetch(event.request));
    return;
  }

  // HTML / JS / CSS はネットワーク優先。GitHub Pages更新後に古い画面が残りにくくします。
  if (isAppShellRequest(requestUrl, event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cached) => cached || fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match("./index.html")))
  );
});
