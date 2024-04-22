import { IS_MAINNET } from '@lensshare/data/constants';


import getCurrentSession from './getCurrentSession';
import getCurrentSessionProfileId from './getCurrentSessionProfileId';
import { hydrateLeafwatchAnonymousId } from 'src/store/persisted/useLeafwatchStore';

const pushToImpressions = (id: string): void => {
  const anonymousId = hydrateLeafwatchAnonymousId();
  const { id: sessionProfileId } = getCurrentSession();
  const publicationProfileId = id.split('-')[0];
  if (publicationProfileId === sessionProfileId) {
    return;
  }

  if ( id && navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'PUBLICATION_VISIBLE',
      id,
      viewerId: sessionProfileId || anonymousId
    });
  }

  return;
};

export default pushToImpressions;