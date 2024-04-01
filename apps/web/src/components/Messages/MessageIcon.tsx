import { EnvelopeIcon } from '@heroicons/react/24/outline';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import { fromNanoString, SortDirection } from '@xmtp/xmtp-js';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffect } from 'react';

import { useAppStore } from 'src/store/useAppStore';
import { useMessagePersistStore } from 'src/store/message';
import { useClient } from '@xmtp/react-sdk';

const MessageIcon: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const clearMessagesBadge = useMessagePersistStore(
    (state) => state.clearMessagesBadge
  );
  const viewedMessagesAtNs = useMessagePersistStore(
    (state) => state.viewedMessagesAtNs
  );
  const showMessagesBadge = useMessagePersistStore(
    (state) => state.showMessagesBadge
  );
  const setShowMessagesBadge = useMessagePersistStore(
    (state) => state.setShowMessagesBadge
  );
  const { client: cachedClient } = useClient();

  const shouldShowBadge = (
    viewedAt: string | undefined,
    messageSentAt: Date | undefined
  ): boolean => {
    if (!messageSentAt) {
      return false;
    }

    const viewedMessagesAt = fromNanoString(viewedAt);

    return (
      !viewedMessagesAt ||
      (viewedMessagesAt.getTime() < messageSentAt.getTime() &&
        messageSentAt.getTime() < new Date().getTime())
    );
  };

  useEffect(() => {
    if (!cachedClient || !currentProfile) {
      return;
    }

    const fetchShowBadge = async () => {
      const convos = await cachedClient.conversations.list();

      if (convos.length <= 0) {
        return;
      }

      const topics = convos.map((convo) => convo.topic);
      const queryResults = await cachedClient.apiClient.batchQuery(
        topics.map((topic) => ({
          contentTopic: topic,
          pageSize: 1,
          direction: SortDirection.SORT_DIRECTION_DESCENDING
        }))
      );
      const mostRecentTimestamp = queryResults.reduce(
        (lastTimestamp: string | null, envelopes) => {
          if (!envelopes.length || !envelopes[0]?.timestampNs) {
            return lastTimestamp;
          }
          if (!lastTimestamp || envelopes[0]?.timestampNs > lastTimestamp) {
            return envelopes[0].timestampNs;
          }
          return lastTimestamp;
        },
        null
      );
      // No messages have been sent or received by the user, ever
      const sentAt = fromNanoString(mostRecentTimestamp ?? undefined);
      const showBadge = shouldShowBadge(
        viewedMessagesAtNs.get(currentProfile.id),
        sentAt
      );
      showMessagesBadge.set(currentProfile.id, showBadge);
      setShowMessagesBadge(new Map(showMessagesBadge));
    };

    let messageStream: AsyncGenerator<DecodedMessage>;
    const closeMessageStream = async () => {
      if (messageStream) {
        await messageStream.return(undefined); // eslint-disable-line unicorn/no-useless-undefined
      }
    };

    // For v1 badging, only badge when not already viewing messages. Once we have
    // badging per-conversation, we can remove this.
    const newMessageValidator = (profileId: string): boolean => {
      return (
        !window.location.pathname.startsWith('/xmtp') &&
        currentProfile.id === profileId
      );
    };

    const streamAllMessages = async (
      messageValidator: (profileId: string) => boolean
    ) => {
      messageStream = await cachedClient.conversations.streamAllMessages();

      for await (const message of messageStream) {
        if (messageValidator(currentProfile.id)) {
          const isFromPeer =
            currentProfile.ownedBy.address !== message.senderAddress;
          if (isFromPeer) {
            const showBadge = shouldShowBadge(
              viewedMessagesAtNs.get(currentProfile.id),
              message.sent
            );
            showMessagesBadge.set(currentProfile.id, showBadge);
            setShowMessagesBadge(new Map(showMessagesBadge));
          }
        }
      }
    };

    fetchShowBadge();
    streamAllMessages(newMessageValidator);

    return () => {
      closeMessageStream();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedClient, currentProfile?.id]);

  return (
    <Link
      href="/messages"
      className="  rounded-md  hover:bg-gray-300/20 "
      onClick={() => {
        currentProfile && clearMessagesBadge(currentProfile.handle?.id);
      }}
    >
      <EnvelopeIcon className="h-6 w-6 sm:h-6 sm:w-6" />
      {showMessagesBadge.get(currentProfile?.handle?.id) ? (
        <span className="z-[6] h-2 w-2 rounded-full bg-red-500 text-red-500" />
      ) : null}
    </Link>
  );
};

export default MessageIcon;
