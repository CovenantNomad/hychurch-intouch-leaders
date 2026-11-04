const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')
const vm = require('node:vm')

const root = path.join(__dirname, '..')
const source = readFileSync(path.join(root, 'public/sw.js'), 'utf8')
const origin = 'https://leaders.example.test'

function worker({ offline = false, missingFallback = false } = {}) {
  const handlers = {}
  const calls = { fetch: [], precache: [], deleted: [], claimed: false }
  const fallback = new Response('offline 안내')
  const networkResponse = new Response('network response')
  const cache = {
    addAll: async (requests) => {
      calls.precache.push(...requests)
    },
    match: async (key) =>
      key === '/offline.html' && !missingFallback ? fallback : undefined,
  }
  class WorkerRequest extends Request {
    constructor(url, options) {
      super(new URL(url, origin), options)
    }
  }
  vm.runInNewContext(source, {
    URL,
    Request: WorkerRequest,
    Response,
    self: {
      location: { origin },
      clients: {
        claim: async () => {
          calls.claimed = true
        },
      },
      addEventListener: (name, handler) => {
        handlers[name] = handler
      },
    },
    caches: {
      open: async () => cache,
      keys: async () => [
        'intouch-leaders-pwa-v0',
        'intouch-leaders-pwa-v1',
        'intouch-leaders-pwa-v2',
        'other-app',
      ],
      delete: async (key) => {
        calls.deleted.push(key)
      },
    },
    fetch: async (request) => {
      calls.fetch.push(request)
      if (offline) throw new TypeError('Network unavailable')
      return networkResponse
    },
  })
  function request(url, options = {}) {
    let response
    handlers.fetch({
      request: {
        url: new URL(url, origin).href,
        method: 'GET',
        mode: 'navigate',
        ...options,
      },
      respondWith: (promise) => {
        response = promise
      },
    })
    return response
  }
  return { handlers, calls, request, networkResponse, fallback }
}

test('manifest uses standalone launch and correctly sized PNG icons', () => {
  const manifest = JSON.parse(
    readFileSync(path.join(root, 'public/manifest.webmanifest'), 'utf8')
  )
  assert.equal(manifest.display, 'standalone')
  assert.equal(manifest.start_url, '/')
  assert.equal(manifest.scope, '/')
  assert.deepEqual(
    manifest.icons.map((icon) => icon.sizes),
    ['192x192', '512x512']
  )
  for (const icon of manifest.icons) {
    const png = readFileSync(path.join(root, 'public', icon.src))
    assert.equal(png.subarray(1, 4).toString(), 'PNG')
    assert.equal(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`, icon.sizes)
  }
})

test('installation precaches only public offline assets', async () => {
  const { handlers, calls } = worker()
  let done
  handlers.install({
    waitUntil: (promise) => {
      done = promise
    },
  })
  await done
  assert.deepEqual(
    calls.precache.map((request) => new URL(request.url).pathname),
    [
      '/offline.html',
      '/images/pwa-icon-192-v2.png',
      '/images/pwa-icon-512-v2.png',
      '/images/apple-touch-icon-v2.png',
    ]
  )
  assert.ok(calls.precache.every((request) => request.cache === 'reload'))
})

test('activation removes only this app’s obsolete caches', async () => {
  const { handlers, calls } = worker()
  let done
  handlers.activate({
    waitUntil: (promise) => {
      done = promise
    },
  })
  await done
  assert.deepEqual(calls.deleted, ['intouch-leaders-pwa-v0', 'intouch-leaders-pwa-v1'])
  assert.equal(calls.claimed, true)
})

test('online navigation returns the live response without caching it', async () => {
  const { request, networkResponse, calls } = worker()
  assert.equal(await request('/cell/members/123'), networkResponse)
  assert.equal(calls.fetch.length, 1)
})

test('offline deep links return a generic offline page', async () => {
  const { request, fallback } = worker({ offline: true })
  assert.equal(await request('/cell/members/123'), fallback)
})

test('missing offline cache returns a network error', async () => {
  const { request } = worker({ offline: true, missingFallback: true })
  assert.equal((await request('/attendance')).type, 'error')
})

test('API, mutations, external requests and Next data are never intercepted', () => {
  const { request, calls } = worker({ offline: true })
  assert.equal(request('/api'), undefined)
  assert.equal(request('/api/graphql'), undefined)
  assert.equal(request('/attendance', { method: 'POST' }), undefined)
  assert.equal(request('https://firestore.googleapis.com/data'), undefined)
  assert.equal(request('/_next/data/build/cell.json'), undefined)
  assert.equal(request('/graphql', { mode: 'cors' }), undefined)
  assert.equal(calls.fetch.length, 0)
})

test('uncached data/assets are not replaced with offline HTML', () => {
  const { request } = worker({ offline: true })
  assert.equal(request('/private.json', { mode: 'cors' }), undefined)
  assert.equal(request('/images/thumbnail.png', { mode: 'no-cors' }), undefined)
})
