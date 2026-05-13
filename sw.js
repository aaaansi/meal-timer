const CACHE_NAME = "mealoclock-v1";
const ASSETS = [
    "/meal-timer/",
    "/meal-timer/index.html",
    "/meal-timer/style.css",
    "/meal-timer/manifest.json",
    "/meal-timer/js/timeUtils.js",
    "/meal-timer/js/calculator.js",
    "/meal-timer/js/meals.js",
    "/meal-timer/js/compliance.js",
    "/meal-timer/js/render.js",
    "/meal-timer/js/storage.js",
    "/meal-timer/js/app.js",
    "/meal-timer/js/mood.js",
    "/meal-timer/icons/icon-192.png",
    "/meal-timer/icons/icon-512.png"
];

// Install — cache all assets
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate — clean old caches
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch — serve from cache, fallback to network
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(cached => cached || fetch(event.request))
    );
});