import { XMTP_PREFIX } from '@lensshare/data/constants';

/**
 * Returns a regex that matches a conversation ID for the given profile ID.
 *
 * @param handle The profile ID to match.
 * @returns A regular expression object that matches the conversation ID.
 */
const conversationMatchesProfile = (handle: string) =>
  new RegExp(`${XMTP_PREFIX}/.*${handle}`);

export default conversationMatchesProfile;
