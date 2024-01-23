import { ClockIcon, FaceFrownIcon } from '@heroicons/react/24/outline';
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import type { Profile } from '@lensshare/lens';

import getAvatar2 from '@lensshare/lib/getAvatar2';
import getStampFyiURL from '@lensshare/lib/getStampFyiURL';
import { Card, Image } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';

import type { DecodedMessage } from '@xmtp/xmtp-js';
import type { FC, ReactNode } from 'react';
import React, { memo, useEffect } from 'react';
import { useInView } from 'react-cool-inview';
import {
  type FailedMessage,
  isQueuedMessage,
  type PendingMessage
} from 'src/hooks/useSendOptimisticMessage';
import { useMessageStore } from 'src/store/message';

import MessageContent from './MessageContent';
import { getTimeFromNow } from 'src/hooks/formatTime4';
import formatTime from 'src/hooks/formatTime';
import { formatDate } from '@lib/formatTime';
import { isOnSameDay } from 'src/hooks/formatTime5';
import { useAppStore } from 'src/store/useAppStore';

interface MessageTileProps {
  url?: string;
  message: DecodedMessage | PendingMessage | FailedMessage;
  profile?: Profile;
  currentProfile?: Profile | null;
}

const MessageTile: FC<MessageTileProps> = ({
  url,
  message,
  profile,
 
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const address = currentProfile?.ownedBy.address


  // icon to display to indicate status of message
  let statusIcon: JSX.Element | null = null;
  if (isQueuedMessage(message)) {
    switch (message.status) {
      case 'failed':
        statusIcon = <ExclamationTriangleIcon width={14} height={14} />;
        break;
      case 'pending':
        statusIcon = <ClockIcon width={14} height={14} />;
        break;
    }
  } else {
    // message has been successfully sent
    statusIcon = <CheckIcon width={14} height={14} />;
  }

  // content to display to indicate message status
  let statusContent: ReactNode = null;
  if (isQueuedMessage(message)) {
    switch (message.status) {
      case 'failed':
        statusContent = (
          <span className="flex items-center gap-1 text-red-500">
            Not delivered &bull;
            <span className="cursor-pointer underline" onClick={message.retry}>
              Retry
            </span>
            &bull;
            <span className="cursor-pointer underline" onClick={message.cancel}>
              Cancel
            </span>
          </span>
        );
        break;
      case 'pending':
        statusContent = getTimeFromNow(message.sent);
        break;
    }
  } else {
    // message has been successfully sent
    statusContent = getTimeFromNow(message.sent);
  }

  return (
    <div
      className={cn(
        address === message.senderAddress ? 'mx-4 items-end' : 'items-start',
        'mb-4 flex flex-col'
      )}
    >
      <div className="flex max-w-[60%]">
        {address !== message.senderAddress ? (
          <Image
            src={profile ? getAvatar2(profile) : url ? url : getAvatar2('')}
            className="mr-2 h-10 w-10 rounded-full border bg-gray-200 dark:border-gray-700"
            alt={profile?.handle?.fullHandle}
          />
        ) : null}
        <div
          className={cn(
            address === message.senderAddress
              ? 'bg-brand-500'
              : 'bg-gray-100 dark:bg-gray-700',
            'w-full rounded-lg px-4 py-2'
          )}
        >
          <span
            className={cn(
              address === message.senderAddress && 'text-white',
              'text-md linkify-message block break-words'
            )}
          >
            <MessageContent
              message={message}
              profile={profile}
              sentByMe={address == message.senderAddress}
            />
          </span>
        </div>
      </div>
      <div className={cn(address !== message.senderAddress ? 'ml-12' : '')}>
        <span
          className={cn(
            address === message.senderAddress ? 'flex-row' : 'flex-row-reverse',
            'flex items-center gap-1 text-xs text-gray-400'
          )}
          title={formatTime(message.sent)}
        >
          {statusIcon}
          {statusContent}
        </span>
      </div>
    </div>
  );
};

interface DateDividerBorderProps {
  children: ReactNode;
}

const DateDividerBorder: FC<DateDividerBorderProps> = ({ children }) => (
  <>
    <div className="h-0.5 grow bg-gray-300/25" />
    {children}
    <div className="h-0.5 grow bg-gray-300/25" />
  </>
);

const DateDivider: FC<{ date?: Date }> = ({ date }) => (
  <div className="align-items-center flex items-center p-4 pl-2 pt-0">
    <DateDividerBorder>
      <span className="mx-11 flex-none text-sm font-bold text-gray-300">
        {formatDate(date)}
      </span>
    </DateDividerBorder>
  </div>
);

const MissingXmtpAuth: FC = () => (
  <Card
    as="aside"
    className="mb-2 mr-4 space-y-2.5 border-gray-400 !bg-gray-300/20 p-5"
  >
    <div className="flex items-center space-x-2 font-bold">
      <FaceFrownIcon className="h-5 w-5" />
      <p>This fren hasn't enabled DMs yet</p>
    </div>
    <p className="text-sm leading-[22px]">
      You can't send them a message until they enable DMs.
    </p>
  </Card>
);

const ConversationBeginningNotice: FC = () => (
  <div className="align-items-center mt-6 flex justify-center pb-4">
    <span className="text-sm font-bold text-gray-300">
      This is the beginning of the conversation
    </span>
  </div>
);

const LoadingMore: FC = () => (
  <div className="mt-6 p-1 text-center text-sm font-bold text-gray-300">
    Loading...
  </div>
);

interface MessageListProps {
  conversationKey?: string;
  messages: (DecodedMessage | PendingMessage | FailedMessage)[];
  fetchNextMessages: () => void;
  profile?: Profile;
  currentProfile?: Profile | null;
  hasMore: boolean;
  missingXmtpAuth: boolean;
  listRef: React.RefObject<HTMLDivElement>;
}

const MessagesList: FC<MessageListProps> = ({
  conversationKey,
  messages,
  fetchNextMessages,
  profile,
  currentProfile,
  hasMore,
  missingXmtpAuth,
  listRef
}) => {
  let lastMessageDate: Date | undefined;

  const { observe } = useInView({
    onChange: ({ inView }) => {
      if (!inView) {
        return;
      }

      fetchNextMessages();
    }
  });

  // scroll to the bottom of the message list when a conversation is selected
  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationKey]);

  const ensNames = useMessageStore((state) => state.ensNames);
  const ensName = ensNames.get(conversationKey?.split('/')[0] ?? '');
  const url = (ensName && getStampFyiURL(conversationKey?.split('/')[0] ?? '')) ?? '';

  return (
    <div className="flex grow  overflow-y-hidden">
      <div className="relative flex h-full w-full pl-4">
        <div className="flex h-full w-full flex-col-reverse overflow-y-hidden">
          {missingXmtpAuth ? <MissingXmtpAuth /> : null}
          <div
            ref={listRef}
            className="flex  flex-col-reverse overflow-y-auto overflow-x-hidden"
          >
            {messages?.map((msg, index) => {
              const dateHasChanged = lastMessageDate
                ? !isOnSameDay(lastMessageDate, msg.sent)
                : false;
              const messageDiv = (
                <div
                  key={`${msg.id}_${index}`}
                  ref={index === messages.length - 1 ? observe : null}
                >
                  <MessageTile
                    url={url}
                    currentProfile={currentProfile}
                    profile={profile}
                    message={msg}
                  />
                  {dateHasChanged ? (
                    <DateDivider date={lastMessageDate} />
                  ) : null}
                </div>
              );
              lastMessageDate = msg.sent;
              return messageDiv;
            })}
            {hasMore ? <LoadingMore /> : <ConversationBeginningNotice />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MessagesList);
