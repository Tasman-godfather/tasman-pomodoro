const CACHE_NAME = 'tasman-pomodoro-prototype-v3';
const APP_SHELL = [
  './index.html',
  './manifest.webmanifest',
  './app-icon.svg',
  './app-icon-180.png',
  './app-icon-512.png',
  'https://unpkg.com/react@18.2.0/umd/react.development.js',
  'https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone@7.24.7/babel.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        const responseCopy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
        return response;
      });
    })
  );
});
