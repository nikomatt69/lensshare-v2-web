import MetaTags from '@components/Common/MetaTags';
import MessageHeader from '@components/Messages/MessageHeader';
import Loader from '@components/Shared/Loader';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@lensshare/data/constants';

import sanitizeDisplayName from '@lensshare/lib/sanitizeDisplayName';
import { Card, GridItemEight, GridLayout } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';

import type { NextPage } from 'next';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useGetMessagePreviews from 'src/hooks/useGetMessagePreviews';
import useGetMessages from 'src/hooks/useGetMessages';
import { useGetProfile } from 'src/hooks/useMessageDb';
import useMessagePreviews from 'src/hooks/useMessagePreviews';
import type {
  FailedMessage,
  PendingMessage
} from 'src/hooks/useSendOptimisticMessage';
import useSendOptimisticMessage from 'src/hooks/useSendOptimisticMessage';
import useStreamMessages from 'src/hooks/useStreamMessages';
import { useAppStore } from 'src/store/useAppStore';
import { useMessageStore } from 'src/store/message';
import { usePreferencesStore } from 'src/store/usePreferencesStore';
import useResizeObserver from 'use-resize-observer';

import Composer from './Composer';
import MessagesList from './MessagesList';
import PreviewList from './PreviewList';

interface MessageProps {
  conversationKey?: string;
}

const Message: FC<MessageProps> = ({}) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const conversationKey = useMessageStore((state) => state.conversationKey);
  const staffMode = usePreferencesStore((state) => state.staffMode);
  const queuedMessages = useMessageStore((state) =>
    state.queuedMessages.get(conversationKey)
  );
  const addQueuedMessage = useMessageStore((state) => state.addQueuedMessage);
  const removeQueuedMessage = useMessageStore(
    (state) => state.removeQueuedMessage
  );
  const updateQueuedMessage = useMessageStore(
    (state) => state.updateQueuedMessage
  );
  const [endTime, setEndTime] = useState<Map<string, Date>>(new Map());
  const { profile } = useGetProfile(currentProfile?.id, conversationKey);
  const { messages, hasMore } = useGetMessages(
    conversationKey,
    endTime.get(conversationKey)
  );
  useStreamMessages(conversationKey);

  const {
    authenticating,
    loading,
    messages: messagePreviews,
    profilesToShow,
    profilesError
  } = useMessagePreviews();

  const { loading: previewsLoading, progress: previewsProgress } =
    useGetMessagePreviews();

  const onMessageQueue = useCallback(
    (message: PendingMessage | FailedMessage) => {
      addQueuedMessage(conversationKey, message);
    },
    [addQueuedMessage, conversationKey]
  );
  const onMessageCancel = useCallback(
    (id: string) => {
      removeQueuedMessage(conversationKey, id);
    },
    [removeQueuedMessage, conversationKey]
  );
  const onMessageUpdate = useCallback(
    (id: string, message: PendingMessage | FailedMessage) => {
      updateQueuedMessage(conversationKey, id, message);
    },
    [updateQueuedMessage, conversationKey]
  );
  const { missingXmtpAuth, sendMessage } = useSendOptimisticMessage(
    conversationKey,
    {
      onQueue: onMessageQueue,
      onCancel: onMessageCancel,
      onUpdate: onMessageUpdate
    }
  );

  const { ref: divref, width: divWidth = 1080 } =
    useResizeObserver<HTMLDivElement>();

  const allMessages = useMemo(() => {
    // if the queued message is in sent messages, ignore it
    // it is expected that this will occur and provides a clean
    // transition from "pending" to "sent" state
    const finalQueuedMessage = (queuedMessages ?? []).reduce(
      (result, queuedMessage) => {
        const found = messages?.some((m) => m.id === queuedMessage.id);
        if (!found) {
          return [...result, queuedMessage];
        }
        return result;
      },
      [] as (PendingMessage | FailedMessage)[]
    );
    return [...finalQueuedMessage, ...(messages ?? [])];
  }, [messages, queuedMessages]);

  // remove pending messages from state after they've been sent
  useEffect(() => {
    if (queuedMessages) {
      for (const queuedMessage of queuedMessages) {
        let found: string = '';
        messages?.some((m) => {
          if (m.id === queuedMessage.id) {
            found = m.id;
            return true;
          }
        });
        if (found) {
          removeQueuedMessage(conversationKey, found);
          continue;
        }
      }
    }
    // only run this effect when messages changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const fetchNextMessages = useCallback(() => {
    if (hasMore && Array.isArray(messages) && messages.length > 0) {
      const lastMsgDate = messages[messages.length - 1].sent;
      if (conversationKey) {
        const currentEndTime = endTime.get(conversationKey);
        if (!currentEndTime || lastMsgDate <= currentEndTime) {
          endTime.set(conversationKey, lastMsgDate);
          setEndTime(new Map(endTime));
        }
      }
    }
  }, [conversationKey, hasMore, messages, endTime]);

  const showLoading = !missingXmtpAuth && !currentProfile;

  const userNameForTitle =
    sanitizeDisplayName(profile?.metadata?.displayName) ?? profile?.handle;

  const title = userNameForTitle
    ? `${userNameForTitle} • ${APP_NAME}`
    : `Messages • ${APP_NAME}`;

  return (
    <div ref={divref}>
      <GridLayout classNameChild="md:gap-8">
        <MetaTags title={title} />
        {divWidth > 1025 || conversationKey === '' ? (
          <PreviewList
            selectedConversationKey={conversationKey}
            previewsLoading={previewsLoading}
            previewsProgress={previewsProgress}
            authenticating={authenticating}
            loading={loading}
            messages={messagePreviews}
            profilesToShow={profilesToShow}
            profilesError={profilesError}
          />
        ) : null}
        {divWidth > 1025 || conversationKey ? (
          <GridItemEight className="xs:mx-2 relative mb-0 sm:mx-2 md:col-span-8">
            {conversationKey ? (
              <Card
                className={cn(
                  staffMode
                    ? 'mb-2 h-[calc(100vh-9.78rem)]'
                    : 'mb-2 h-[calc(100vh-12.5rem)]',
                  'xs:mx-2 xs:h-[78vh] xs:mx-2 xs:col-span-4 mb-0 flex w-full  flex-col justify-between rounded-xl sm:mx-2 sm:h-[70vh] md:col-span-4 md:h-[80vh] xl:h-[84vh]'
                )}
              >
                {showLoading ? (
                  <div className="flex h-full grow items-center justify-center">
                    <Loader message={`Loading messages`} />
                  </div>
                ) : (
                  <>
                    <MessageHeader
                      profile={profile}
                      conversationKey={conversationKey}
                    />
                    <MessagesList
                      conversationKey={conversationKey}
                      currentProfile={currentProfile}
                      profile={profile}
                      fetchNextMessages={fetchNextMessages}
                      messages={allMessages}
                      hasMore={hasMore}
                      missingXmtpAuth={missingXmtpAuth ?? false}
                      listRef={listRef}
                    />
                    <Composer
                      listRef={listRef}
                      sendMessage={sendMessage}
                      conversationKey={conversationKey}
                      disabledInput={missingXmtpAuth ?? false}
                    />
                  </>
                )}
              </Card>
            ) : (
              <Card className="h-full">
                <div className="flex h-full flex-col text-center">
                  <div className="m-auto">
                    <span className="text-center text-5xl">👋</span>
                    <h3 className="mb-2 mt-3 text-lg">Select a conversation</h3>
                    <p className="text-md lt-text-gray-500 max-w-xs">
                      Choose an existing conversation or create a new one to
                      start messaging
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </GridItemEight>
        ) : null}
      </GridLayout>
    </div>
  );
};

const MessagePage: NextPage = () => {
  const currentProfileId = useAppStore((state) => state.currentProfile);

  // Need to have a login page for when there is no currentProfileId
  if (!currentProfileId) {
    return <NotLoggedIn />;
  }

  return <Message />;
};

export default MessagePage;
