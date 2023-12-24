import { IS_MAINNET } from '@lensshare/data/constants';
import { hydrateLeafwatchAnonymousId } from 'src/store/useLeafwatchPersistStore';

import getCurrentSession from './getCurrentSession';
import getCurrentSessionProfileId from './getCurrentSessionProfileId';
/**
 * Push publication to impressions queue
 * @param id Publication ID
 * @returns void
 */
const pushToImpressions = (id: string): void => {
  const anonymousId = hydrateLeafwatchAnonymousId();
  const { id: sessionProfileId } = getCurrentSession();

  if (IS_MAINNET && id && navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage({
      id,
      type: 'PUBLICATION_VISIBLE',
      viewerId: sessionProfileId || anonymousId
    });
  }

  return;
};

export default pushToImpressions;
