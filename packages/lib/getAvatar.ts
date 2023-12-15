import { AVATAR, ZERO_ADDRESS } from '@lensshare/data/constants';

import getStampFyiURL from './getStampFyiURL';
import imageKit from './imageKit';
import sanitizeDStorageUrl from './sanitizeDStorageUrl';
import getLennyURL from './getLennyURL';

/**
 * Returns the avatar image URL for a given profile.
 *
 * @param profile The profile object.
 * @param namedTransform The named transform to use.
 * @returns The avatar image URL.
 */
const getAvatar = (profile: any, namedTransform = AVATAR): string => {
  const avatarUrl =
    // Group Avatar fallbacks
    profile?.avatar ??
    // Lens NFT Avatar fallbacks
    profile?.metadata?.picture?.image?.optimized?.uri ??
    profile?.metadata?.picture?.image?.raw?.uri ??
    // Lens Profile Avatar fallbacks
    profile?.metadata?.picture?.optimized?.uri ??
    profile?.metadata?.picture?.raw?.uri ??
    // Stamp.fyi Avatar fallbacks
    getLennyURL(profile?.id);

  return imageKit(sanitizeDStorageUrl(avatarUrl), namedTransform);
};

export default getAvatar;
