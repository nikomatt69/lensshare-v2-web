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



navigator.serviceWorker.register('sw.js');
const webPush = require('web-push');

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log(
    'You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY ' +
      'environment variables. You can use the following ones:'
  );
  console.log(webPush.generateVAPIDKeys());
}
// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
  'https://lenshareapp.xyz/',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = function (
  app: {
    get: (arg0: string, arg1: (req: any, res: any) => void) => void;
    post: (
      arg0: string,
      arg1: { (req: any, res: any): void; (req: any, res: any): void }
    ) => void;
  },
  route: string
) {
  app.get(
    route + 'vapidPublicKey',
    function (req: any, res: { send: (arg0: string | undefined) => void }) {
      res.send(process.env.VAPID_PUBLIC_KEY);
    }
  );

  app.post(
    route + 'register',
    function (req: any, res: { sendStatus: (arg0: number) => void }) {
      // A real world application would store the subscription info.
      res.sendStatus(201);
    }
  );

  app.post(
    route + 'sendNotification',
    function (
      req: { body: { subscription: any; ttl: any; delay: number } },
      res: { sendStatus: (arg0: number) => void }
    ) {
      const { subscription } = req.body;
      const payload = null;
      const options = {
        TTL: req.body.ttl
      };

      setTimeout(function () {
        webPush
          .sendNotification(subscription, payload, options)
          .then(function () {
            res.sendStatus(201);
          })
          .catch(function (error: any) {
            console.log(error);
            res.sendStatus(500);
          });
      }, req.body.delay * 1000);
    }
  );
};

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
      icon: '/images/icon.png',
      vibrate: [500, 100, 500]
    })
  );
});

export {};
