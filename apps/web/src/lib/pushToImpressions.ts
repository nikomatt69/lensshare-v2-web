import { IS_MAINNET } from '@lensshare/data/constants';


import getCurrentSession from './getCurrentSession';
import getCurrentSessionProfileId from './getCurrentSessionProfileId';
import { hydrateLeafwatchAnonymousId } from 'src/store/persisted/useLeafwatchStore';

/**
 * Push publication to impressions queue
 * @param id Publication ID
 * @returns void
 */
const pushToImpressions = (id: string): void => {
  const anonymousId = hydrateLeafwatchAnonymousId();
  const { id: sessionProfileId } = getCurrentSession();

  // Don't push impressions for the current user
  const publicationProfileId = id.split('-')[0];
  if (publicationProfileId === sessionProfileId) {
    return;
  }

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
