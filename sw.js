// Uygulama kabuğunu önbelleğe alır: internet zayıfken de açılır. API istekleri her zaman ağdan gider.
const SURUM = "dizi-studyo-v3";
const KABUK = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(SURUM).then(c => c.addAll(KABUK))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== SURUM).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin || e.request.method !== "GET") return;
  // önce ağ (güncel sürüm), olmazsa önbellek
  e.respondWith(fetch(e.request, { cache: "no-store" }).then(r => {
    const kopya = r.clone(); caches.open(SURUM).then(c => c.put(e.request, kopya)); return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
