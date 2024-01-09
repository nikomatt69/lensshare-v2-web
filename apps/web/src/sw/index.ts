importScripts('https://progressier.app/UyYlhOtlyHyST7enRwK8/sw.js');
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ServiceWorkerCache } from './cache';


declare let self: ServiceWorkerGlobalScope;

const impressionsEndpoint = 'https://api.lenshareapp.xyz/leafwatch/impressions';
const publicationsVisibilityInterval = 5000;
let viewerId: null | string = null;
const visiblePublicationsSet = new Set();

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
  // Impression tracking
  if (event.data && event.data.type === 'PUBLICATION_VISIBLE') {
    visiblePublicationsSet.add(event.data.id);
    viewerId = event.data.viewerId;
  }
});
self.addEventListener('fetch', handleFetch);
self.addEventListener('install', (event) => event.waitUntil(handleInstall()));
self.addEventListener('activate', (event) => event.waitUntil(handleActivate()));

export {};
