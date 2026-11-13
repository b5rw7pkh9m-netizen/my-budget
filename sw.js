// My Budget offline helper.
// Caches ONLY the app's own files (plus the sign-in library) so the app opens offline.
// It never stores or intercepts Supabase data or sign-in requests.
const CACHE = 'my-budget-v2';
const APP_FILES = ['./', './index.html', './config.js', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
const LIB_HOST = 'cdn.jsdelivr.net';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isLib = url.hostname === LIB_HOST && url.pathname.includes('@supabase/supabase-js');
  const appPaths = APP_FILES.map(f => new URL(f, self.registration.scope).pathname);
  const isAppFile = sameOrigin && appPaths.includes(url.pathname);
  if (!isAppFile && !isLib) return; // Supabase, sign-in and anything else go straight to the network, never cached

  // Network first, so updates arrive right away; fall back to the saved copy when offline.
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req, { ignoreSearch: sameOrigin }).then(hit =>
          hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())
        )
      )
  );
});
