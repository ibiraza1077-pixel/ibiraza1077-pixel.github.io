// UniLondon service worker: works offline, always tries for fresh listings first.
const CACHE = "unilondon-v3";
const CORE = ["./", "index.html", "styles.css", "app.js", "config.js", "listings.json", "events.json", "manifest.webmanifest", "icons/icon-192.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("unilondon-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  // Network first for everything on our origin, so edits to listings and code show up straight away; cache is the offline fallback.
  e.respondWith(
    fetch(e.request).then(async res => {
      if (!res.ok) throw new Error("Network response unavailable");
      const cache = await caches.open(CACHE);
      await cache.put(e.request, res.clone());
      return res;
    })
      .catch(() => caches.match(e.request).then(r => r || (e.request.mode === "navigate" ? caches.match("index.html") : Response.error())))
  );
});
