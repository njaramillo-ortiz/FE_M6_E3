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

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // estrategia cache first para archivos estáticos
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
  }

  // estrategia network first para datos dinámicos
  else if (isDynamicData(request)) {
    event.respondWith(networkFirst(request));
  }

  // estrategia stale while revalidate para contenido mixto
  else {
    event.respondWith(staleWhileRevalidate(request));
  }
});


function isStaticAsset(request) {
  return STATIC_ASSETS.includes(new URL(request.url).pathname);
}

function isDynamicData(request) {
  return request.url.includes('/api/');
}

function cacheFirst(request) {
  return caches.match(request)
    .then((cachedResponse) => {
      return cachedResponse || fetch(request)
        .then((networkResponse) => {
          // guardar respuesta en cache
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(request, responseToCache));
          return networkResponse;
        });
    });
}

function networkFirst(request) {
  return fetch(request)
    .then((networkResponse) => {
      // guardar respuesta en cache
      const responseToCache = networkResponse.clone();
      caches.open(CACHE_NAME)
        .then((cache) => cache.put(request, responseToCache));
      return networkResponse;
    })
    .catch(() => {
      // servir respuesta cacheada
      return caches.match(request);
    });
}

function staleWhileRevalidate(request) {
  return caches.match(request)
    .then((cachedResponse) => {
      // obtener version nueva desde la red
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          // guardar respuesta en cache
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(request, responseToCache));
        });

      // retornar respuesta guardada
      return cachedResponse || fetchPromise.then(() => fetch(request));
    });
}