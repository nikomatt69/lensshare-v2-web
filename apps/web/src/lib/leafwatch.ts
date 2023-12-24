import { BASE_URL } from '@lensshare/data/constants';

import getCurrentSessionProfileId from './getCurrentSessionProfileId';
import getCurrentSession from './getCurrentSession';

let worker: Worker;

if (typeof Worker !== 'undefined') {
  worker = new Worker(new URL('./leafwatchWorker', import.meta.url));
}

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, properties?: Record<string, unknown>) => {
    const { id: sessionProfileId } = getCurrentSession();
    const { referrer } = document;
    const referrerDomain = referrer ? new URL(referrer).hostname : null;

    worker.postMessage({
      actor: sessionProfileId,
      name,
      platform: 'web',
      properties,
      referrer: referrerDomain,
      url: window.location.href
    });

    worker.onmessage = (event: MessageEvent) => {
      const response = event.data;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BASE_URL}/api/leafwatch/events`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(response));
    };
  }
};
