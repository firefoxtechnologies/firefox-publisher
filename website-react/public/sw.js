// Firefox Publisher service worker.
//   Pages (HTML): network first, so visitors always get the newest page; the last copy is used offline.
//   Hashed files in /assets/ and icons: cache first (the file name changes whenever the content does).
//   Everything else on this site (images, search list): fast from cache, refreshed in the background.
//   /api/ and other websites are never cached. With no network and nothing cached, /offline.html is shown.
const VERSION = "v1";
const PAGES = `fp-pages-${VERSION}`;
const FILES = `fp-files-${VERSION}`;
const MAX_FILES = 150;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGES).then((c) => c.addAll(["/offline.html", "/icon-192.png"])).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("fp-") && k !== PAGES && k !== FILES).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trim(cache) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MAX_FILES; i++) await cache.delete(keys[i]);
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGES);
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    return (await cache.match(request, { ignoreSearch: true })) || (await cache.match("/offline.html"));
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(FILES);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) { cache.put(request, res.clone()); trim(cache); }
  return res;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(FILES);
  const hit = await cache.match(request);
  const fresh = fetch(request).then((res) => {
    if (res.ok) { cache.put(request, res.clone()); trim(cache); }
    return res;
  });
  if (hit) { fresh.catch(() => {}); return hit; }
  return fresh;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") return event.respondWith(networkFirstPage(request));
  if (url.pathname.startsWith("/assets/")) return event.respondWith(cacheFirst(request).catch(() => Response.error()));
  if (url.pathname === "/sw.js") return;
  event.respondWith(staleWhileRevalidate(request).catch(() => Response.error()));
});
