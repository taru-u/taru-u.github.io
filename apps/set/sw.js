const CACHE_NAME = "set-solo-v19";
const ALT_ASSETS = [];

for (let first = 1; first <= 3; first += 1) {
  for (let second = 1; second <= 3; second += 1) {
    for (let third = 1; third <= 3; third += 1) {
      for (let fourth = 1; fourth <= 3; fourth += 1) {
        ALT_ASSETS.push(`./set_pngs/alt/${first}${second}${third}${fourth}.png`);
      }
    }
  }
}

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./set_pngs/capsule_filled.png",
  "./set_pngs/capsule_outline.png",
  "./set_pngs/capsule_striped.png",
  "./set_pngs/diamond_filled.png",
  "./set_pngs/diamond_outline.png",
  "./set_pngs/diamond_striped.png",
  "./set_pngs/squiggle_filled.png",
  "./set_pngs/squiggle_outline.png",
  "./set_pngs/squiggle_striped.png",
  ...ALT_ASSETS
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }

        return undefined;
      });
    })
  );
});
