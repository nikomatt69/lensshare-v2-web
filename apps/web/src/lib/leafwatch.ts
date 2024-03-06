import getCurrentSessionProfileId from './getCurrentSessionProfileId';

let worker: Worker;

if (typeof Worker !== 'undefined') {
  worker = new Worker(new URL('./leafwatchWorker', import.meta.url));
}

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, properties?: Record<string, unknown>) => {
    const currentSessionProfileId = getCurrentSessionProfileId();
    const { referrer } = document;
    const referrerDomain = referrer ? new URL(referrer).hostname : null;

    worker.postMessage({
      actor: currentSessionProfileId,
      name,
      platform: 'web',
      properties,
      referrer: referrerDomain,
      url: window.location.href
    });

    worker.onmessage = (event: MessageEvent) => {
      const response = event.data;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `/api/leafwatch/events`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(response));
    };
  }
};
