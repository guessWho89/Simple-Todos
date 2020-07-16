const cacheName = 'v2';
const cacheAssets = [
    'offline.html'
];

// Call install event 
self.addEventListener('install', (e) => {
    console.log('sw: installed');
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('sw: caching files');
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    );
});

// Call activate event
self.addEventListener('activate', (e) => {
    console.log('sw: activated');

    // Remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('sw: clearing old cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});

// Call fetch event 
self.addEventListener('fetch', (e) => {
    console.log('sw: fetching');
    e.respondWith(fetch(e.request)
        .then(res => {
            // Make clone of response
            const resClone = res.clone();
            // Open cache
            caches
                .open(cacheName)
                .then(cache => {
                    // Add response to cache 
                    cache.put(e.request, resClone);
                });
            return res;
        })
        .catch(err => caches.match(e.request)
        // .catch(err => caches.match('offline.html')
            .then(res => res))
    );
});