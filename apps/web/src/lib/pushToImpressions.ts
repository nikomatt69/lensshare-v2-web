import { IS_MAINNET } from '@lensshare/data/constants';
import { hydrateLeafwatchAnonymousId } from 'src/store/useLeafwatchPersistStore';

import getCurrentSession from './getCurrentSession';
import getCurrentSessionProfileId from './getCurrentSessionProfileId';

const pushToImpressions = (id: string): void => {
  const anonymousId = hydrateLeafwatchAnonymousId();
  const currentSessionProfileId = getCurrentSessionProfileId();

  if ( id && navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'PUBLICATION_VISIBLE',
      id,
      viewerId: currentSessionProfileId || anonymousId
    });
  }

  return;
};

export default pushToImpressions;
