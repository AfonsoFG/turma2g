var cacheName = 'horario2g-pwa';
var filesToCache = [
  '/turma2g/',
  '/turma2g/index.html',
  '/turma2g/css/styles.css',
  '/turma2g/js/scripts.js',
  '/turma2g/fonts/Baloo2-ExtraBold.woff2',
  '/turma2g/img/icones/ae.svg',
  '/turma2g/img/icones/af.svg',
  '/turma2g/img/icones/ea.svg',
  '/turma2g/img/icones/ef.svg',
  '/turma2g/img/icones/em.svg',
  '/turma2g/img/icones/en.svg',
  '/turma2g/img/icones/mt.svg',
  '/turma2g/img/icones/mu.svg',
  '/turma2g/img/icones/oc.svg',
  '/turma2g/img/icones/pt.svg',
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});