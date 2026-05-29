const CACHE_NAME = 'static-cache-v1';
const STATIC_FILES = [ 
    '/icons/AddPhoto.svg',
    '/icons/BxsUserCircleB.svg', 
    '/icons/MoreVertical.svg',
    '/icons/PencilSquare.svg',
    '/icons/Location.svg',
    '/icons/Phone.svg',
    '/icons/Time.svg',
    '/icons/LinkChain.svg',
    '/icons/MailSend.svg',
    '/icons/EarthAmericasFilled.svg',
    '/icons/down.png',
    '/icons/facebook.png',
    '/icons/ins.svg', 
    '/empty.jpg', 
    '/favicon.ico',
    '/galeria/bosch.jpg',
    '/galeria/el-gal.jpg',
    '/galeria/focus.png',
    '/galeria/image.png', 
    '/galeria/alo.png',
    '/icons/TaskSettings.svg',
    '/icons/UserCircle.svg',
    '/BOSCH_SERVICE-logo.svg',
    '/fullscreen.png',
    '/person.png',
    '/user.png'  
];

self.addEventListener('install', event => { 
    console.log("cashing");
    
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => { 
        return cache.addAll(STATIC_FILES);
      })
  );
});

self.addEventListener('fetch', event => { 
  if (event.request.method !== 'GET') return; 
  if (event.request.url.includes('/icons/') || 
      event.request.url.includes('/images/') ||
      event.request.url.includes('.svg') ||
      event.request.url.includes('.png') ||
      event.request.url.includes('.jpg')) {
    
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => { 
          if (cachedResponse) {
            return cachedResponse 
          }
           
          return fetch(event.request)
            .then(response => { 
              const responseToCache = response.clone() 
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache) 
                }) 
              return response 
            })
            .catch(error => {
              console.error('Failed to fetch:', error) 
              return new Response('', {
                status: 404,
                statusText: 'Not Found (offline)'
              });
            });
        })
    );
  }
});