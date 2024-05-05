/* eslint-disable @typescript-eslint/no-unused-vars */

declare let self: ServiceWorkerGlobalScope;

const impressionsEndpoint = `https://api.mycrumbs.xyz/leafwatch/impressions`;
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

async function handleInstall(): Promise<void> {
  void self.skipWaiting();
};
self.addEventListener('push', event => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-96x96.png',
        actions: [{ action: 'open_url', title: 'View' }, { action: 'snooze', title: 'Snooze' }],
        data: { url: data.url }
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    if (event.action === 'open_url') {
        clients.openWindow(event.notification.data.url);
    } else if (event.action === 'snooze') {
        // Handle snooze action
    }
});



const handleActivate = async (): Promise<void> => {
  await self.clients.claim();
};

const handleFetch = (event: FetchEvent): void => {
  const request = event.request.clone();
  const { origin } = new URL(request.url);

  if (self.location.origin === origin) {
    event.respondWith;
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
setInterval(sendVisiblePublicationsToServer, publicationsVisibilityInterval);
self.addEventListener('fetch', handleFetch);
self.addEventListener('install', (event) => event.waitUntil(handleInstall()));
self.addEventListener('activate', (event) => event.waitUntil(handleActivate()));

export {};
