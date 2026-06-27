self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  console.log('OmiBus Service worker activated');
});

// A basic fetch handler is required to trigger the "Install App" prompt
self.addEventListener('fetch', (event) => {
  // Pass through without caching for now
});
