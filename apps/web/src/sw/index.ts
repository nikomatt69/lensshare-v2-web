/* eslint-disable @typescript-eslint/no-unused-vars */
import { BASE_URL } from '@lensshare/data/constants';
import { ServiceWorkerCache } from './cache';
importScripts('https://progressier.app/UyYlhOtlyHyST7enRwK8/sw.js');
declare let self: ServiceWorkerGlobalScope;

const impressionsEndpoint = `${BASE_URL}/api/leafwatch/impressions`;
const publicationsVisibilityInterval = 5000;
let viewerId: null | string = null;
let visiblePublicationsSet = new Set();

const sendVisiblePublicationsToServer = () => {
  const publicationsToSend = Array.from(visiblePublicationsSet);

  if (publicationsToSend.length > 0 && viewerId) {
    visiblePublicationsSet.clear();
    fetch(impressionsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        viewer_id: viewerId,
        ids: publicationsToSend
      }),
      keepalive: true
    })
      .then(() => {})
      .catch(() => {});
  }
};

const preCachedAssets = (process.env.STATIC_ASSETS ?? []) as string[];
const CACHEABLE_PATHS = ['/', '/contact', '/explore'];
const CACHEABLE_DOMAINS = [
  'https://static-asset.lenshareapp.xyz',
  'https://asset.lenshareapp.xyz',

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

// Register event listener for the 'push' event.
self.addEventListener('push', function (event) {
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    // Show a notification with title 'ServiceWorker Cookbook' and body 'Alea iacta est'.
    // Set other parameters such as the notification language, a vibration pattern associated
    // to the notification, an image to show near the body.
    // There are many other possible options, for an exhaustive list see the specs:
    //   https://notifications.spec.whatwg.org/
    self.registration.showNotification('LensShare', {
      lang: 'en',
      body: 'New Notification',
      icon: './images/icon.png',
      vibrate: [500, 100, 500]
    })
  );
});

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon
    });
  }
});
// Register a Service Worker.

self.addEventListener('message', (event) => {
  // Impression tracking
  if (event.data && event.data.type === 'PUBLICATION_VISIBLE') {
    visiblePublicationsSet.add(event.data.id);
    viewerId = event.data.viewerId;
  }
});
setInterval(sendVisiblePublicationsToServer, publicationsVisibilityInterval);
self.addEventListener('fetch', handleFetch);
self.addEventListener('install', (event) => event.waitUntil(handleInstall()));
self.addEventListener('activate', (event) => event.waitUntil(handleActivate()));

export {};
