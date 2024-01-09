// Fixed code
importScripts('https://progressier.app/UyYlhOtlyHyST7enRwK8/sw.js');
import { ServiceWorkerCache } from './cache';
declare let self: ServiceWorkerGlobalScope;

const impressionsEndpoint = 'https://api.lenshareapp.xyz/leafwatch/impressions';
const publicationsVisibilityInterval = 5000;
let viewerId: string | null = null;
const visiblePublicationsSet = new Set<string>();

const sendVisiblePublicationsToServer = () => {
  const publicationsToSend = Array.from(visiblePublicationsSet);

  if (publicationsToSend.length > 0 && viewerId) {
    visiblePublicationsSet.clear();
    fetch(impressionsEndpoint, {
      body: JSON.stringify({
        ids: publicationsToSend,
        viewer_id: viewerId
      }),
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      method: 'POST'
    })
      .then(() => {})
      .catch(() => {});
  }
};

setInterval(sendVisiblePublicationsToServer, publicationsVisibilityInterval);

const preCachedAssets = (process.env.STATIC_ASSETS ?? []) as string[];
const CACHEABLE_PATHS = ['/', '/contact', '/explore'];
const CACHEABLE_DOMAINS = [
  'https://static-asset.lenshareapp.xyz',
  'https://asset.lenshareapp.xyz',
  'https://prerender.lenshareapp.xyz'
];

const cache = new ServiceWorkerCache({
  cachePrefix: 'SWCache',
  cacheableRoutes: [...CACHEABLE_PATHS, ...CACHEABLE_DOMAINS],
  staticAssets: preCachedAssets
});

async function handleInstall(): Promise<void> {
  void self.skipWaiting();
  await cache.cacheStaticAssets();
}

const handleActivate = async (): Promise<void> => {
  await self.clients.claim();
  await cache.invalidatePreviousCache();
};

const handleFetch = (event: FetchEvent): void => {
  const request = event.request.clone();
  const { origin } = new URL(request.url);

  if (self.location.origin === origin || CACHEABLE_DOMAINS.includes(origin)) {
    event.respondWith(cache.get(event));
  }
  return;
};
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PUBLICATION_VISIBLE') {
    visiblePublicationsSet.add(event.data.id);
    viewerId = event.data.viewerId;
  }
});
self.addEventListener('fetch', handleFetch);
self.addEventListener('install', (event) => event.waitUntil(handleInstall()));
self.addEventListener('activate', (event) => event.waitUntil(handleActivate()));
self.addEventListener('push', function (event) {
  event.waitUntil(
    self.registration.showNotification('LensShare', {
      lang: 'en',
      body: 'New Notification',
      icon: '/images/icon.png',
      vibrate: [500, 100, 500]
    })
  );
});

export {};
