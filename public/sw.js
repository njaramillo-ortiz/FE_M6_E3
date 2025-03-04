const CACHE_NAME = 'hospital-app-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/equipo.json',
  '/img/icon-192x192.png',
  '/img/icon-512x512.png',
  '/offline.html',
  '/styles.css',  
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache abierto');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting()) 
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone()); 
          return networkResponse;
        });
      }).catch(() => {
        return caches.match('/offline.html');
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); 
});


