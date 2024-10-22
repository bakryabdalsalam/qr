self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing Service Worker...', event);
});

self.addEventListener('fetch', (event) => {
    console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
});
