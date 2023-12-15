import { XMTP_PREFIX } from '@lensshare/data/constants';

/**
 * Builds a unique conversation ID for a chat between two users.
 *
 * @param handleA The profile handle of the first user.
 * @param handleB The profile handle of the second user.
 * @returns The conversation ID.
 */
const buildConversationId = (handleA: string, handleB: string) => {
  const numberA = parseInt(handleA);
  const numberB = parseInt(handleB);
  return numberA < numberB
    ? `${XMTP_PREFIX}/${handleA}-${handleB}`
    : `${XMTP_PREFIX}/${handleB}-${handleA}`;
};

export default buildConversationId;