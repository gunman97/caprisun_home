var cacheName = 'caprisun_airpage_org';
var appShellFiles = [
  '/js/caprisun.js',
  '/js/jquery.min.js',
  '/js/Chart.min.js',
  '/js/jquery.animateNumber.min.js',
  '/css/bootstrap.min.css',
  '/css/caprisun.css',
  '/css/inlinesun.css',
  '/css/font-awesome.min.css',
  '/imgs/android-chrome-192x192.png',
  '/imgs/android-chrome-512x512.png',
  '/imgs/apple-touch-icon.png',
  '/imgs/favicon-16x16.png',
  '/imgs/favicon-32x32.png',
  '/imgs/favicon.ico',
  '/index.html'
];

// Installing Service Worker
self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(appShellFiles);
    })
  );
});

// Fetching content using Service Worker
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
