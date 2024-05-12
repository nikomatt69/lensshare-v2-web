import { HEY_API_URL } from '@lensshare/data/constants';
import getCurrentSession from './getCurrentSession';
import getAuthApiHeaders from '@components/Shared/Oembed/Portal/getAuthApiHeaders main';
import { Localstorage } from '@lensshare/data/storage';

let worker: Worker;

if (typeof Worker !== 'undefined') {
  worker = new Worker(new URL('./leafwatchWorker', import.meta.url));
}

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, properties?: Record<string, unknown>) => {
    const { referrer } = document;
    const referrerDomain = referrer ? new URL(referrer).hostname : null;
    const fingerprint = localStorage.getItem(Localstorage.FingerprintStore);

    worker.postMessage({
      accessToken: getAuthApiHeaders()['X-Access-Token'] || undefined,
      fingerprint: fingerprint || undefined,
      name,
      network: getAuthApiHeaders()['X-Lens-Network'] || undefined,
      platform: 'web',
      properties,
      referrer: referrerDomain,
      url: window.location.href
    });

    worker.onmessage = (event: MessageEvent) => {
      const response = event.data;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${HEY_API_URL}/leafwatch/events`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('x-access-token', response.accessToken);
      xhr.setRequestHeader('x-lens-network', response.network);
      xhr.send(JSON.stringify(response));
    };
  }
};
