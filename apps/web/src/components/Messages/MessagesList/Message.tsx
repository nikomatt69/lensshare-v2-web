import type { CachedConversation, CachedMessageWithId } from '@xmtp/react-sdk';
import cn from '@lensshare/ui/cn';
import { ContentTypeText, hasReaction, useConversations, useReactions, useStreamMessages } from '@xmtp/react-sdk';
import { type FC } from 'react';
import { getTimeFromNow } from 'src/hooks/formatTime4';
import { ContentTypeAudioeKey } from 'src/hooks/codecs/Audio';
import Markup from '@components/Shared/Markup';
import { useAccount } from 'wagmi';
import { useMessageStore } from 'src/store/message';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';
interface MessagesProps {
  message: CachedMessageWithId;
}

const Messages: FC<MessagesProps> = ({ message }) => {
  const { address } = useAccount();
  const { selectedConversation  } = useMessagesStore();             
  const reactions = useReactions(message);
  const messageHasReaction = hasReaction(message);
  const isSender = message.senderAddress === address;
  useStreamMessages(selectedConversation as CachedConversation);

  if (message.contentType === ContentTypeText.toString()) {
    return (
      <div
        className={cn('my-2 flex flex-col', { 'items-end': isSender })}
        key={message.id}
      >
        <div className={cn('flex', { 'justify-end': isSender })}>
          <div
            className={cn(
              isSender
                ? 'bg-gray-700 text-white dark:bg-gray-100 dark:text-black'
                : 'bg-gray-100 dark:bg-gray-700',
              ' break-words rounded-3xl px-4 py-2 text-sm',
              isSender ? 'rounded-br-lg' : 'rounded-bl-lg'
            )}
          >
            <Markup>{message.content}</Markup>
          </div>
        </div>
        <div className="ld-text-gray-500 mt-1 text-xs">
          {getTimeFromNow(message.sentAt)}
        </div>
        {messageHasReaction && (
          <div className="mb-1 mt-1 flex w-fit space-x-2 rounded-full">
            {reactions.map((reaction, index) => (
              <div key={index}>
                <span>{reaction.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const blobCache = new WeakMap<Uint8Array, string>();
  const objectURL = blobCache.get(message.content);
  const isAudioNote = ContentTypeAudioeKey.toString();

  if (message.contentType === isAudioNote) {
    return (
      <div
        className={cn('flex flex-col', { 'items-end': isSender })}
        key={message.id}
      >
        <div className={cn('flex', { 'justify-end': isSender })}>
          <div
            className={cn(
              isSender
                ? 'bg-gray-700 text-white dark:bg-gray-100 dark:text-black'
                : 'bg-gray-100 dark:bg-gray-700',
              'max-w-xs break-words rounded-3xl px-4 py-2',
              isSender ? 'rounded-br-lg' : 'rounded-bl-lg'
            )}
          >
            <div className="max-w-20">
              <audio controls>
                <source src={message.content} />
              </audio>
            </div>
          </div>
        </div>
        <div className="ld-text-gray-500 mt-1 text-xs">
          {getTimeFromNow(message.sentAt)}
        </div>
        {messageHasReaction && (
          <div className="mb-1 mt-1 flex w-fit space-x-2 rounded-full">
            {reactions.map((reaction, index) => (
              <div key={index}>
                <span>{reaction.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default Messages;
