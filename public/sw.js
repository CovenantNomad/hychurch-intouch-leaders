/* eslint-env serviceworker */

// Increment this version when changing the offline page or precached icons.
const CACHE_PREFIX = 'intouch-leaders-pwa-'
const CACHE_NAME = `${CACHE_PREFIX}v2`
const OFFLINE_URL = '/offline.html'
const PUBLIC_ASSETS = [
  OFFLINE_URL,
  '/images/pwa-icon-192-v2.png',
  '/images/pwa-icon-512-v2.png',
  '/images/apple-touch-icon-v2.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(PUBLIC_ASSETS.map((url) => new Request(url, { cache: 'reload' })))
    )
  )
  // Let existing tabs finish before activating a new worker.
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      await Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
      await self.clients.claim()
    })
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // API, Firestore, mutations and Next.js data requests stay network-only.
  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname === '/api' ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/')
  ) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME)
        return (await cache.match(OFFLINE_URL)) || Response.error()
      })
    )
    return
  }

  if (PUBLIC_ASSETS.includes(url.pathname) && !url.search) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        return (await cache.match(url.pathname)) || fetch(request)
      })
    )
  }
})
