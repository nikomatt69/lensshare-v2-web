import { memo, useEffect, useRef, useState } from 'react';
import type { ReactNode, FC } from 'react';
import type { CachedConversation, CachedMessageWithId } from '@xmtp/react-sdk';
import type { Address } from 'viem';
import { useMessages, useStreamMessages } from '@xmtp/react-sdk';
import { useInView } from 'react-cool-inview';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';
import useSendMessage from 'src/hooks/useSendMessage';
import { formatDate } from 'src/hooks/formatTime5';
import cn from '@lensshare/ui/cn';
import Composer from '../Composer';
import Consent from './Consent';
import Messages from './Message';
import LazyDefaultProfile from '@components/Shared/LazyDefaultProfile';

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

const MessagesList: FC = () => {
  const { selectedConversation } = useMessagesStore();
  const [messages, setMessages] = useState<CachedMessageWithId[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = useSendMessage(selectedConversation?.context?.conversationId as string);
  const stream = useStreamMessages(selectedConversation as CachedConversation);

  useEffect(() => {
    stream.onMessage((message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });
    return () => stream.disconnect(); // Disconnect on cleanup
  }, [stream]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!selectedConversation) {
    return null;
  }

  const { observe } = useInView({
    onChange: ({ inView }) => {
      if (inView) {
        stream.resume(); // Resume the message stream when the container is in view
      } else {
        stream.pause(); // Pause the message stream when the container is out of view
      }
    }
  });

  return (
    <div>
      <div className="flex items-center justify-between px-5 py-1">
        <LazyDefaultProfile
          address={selectedConversation.peerAddress as Address}
        />
        <Consent address={selectedConversation.peerAddress as Address} />
      </div>
      <div className="divider" />
      <div
        ref={observe}
        className={cn(
          'h-[69vh] max-h-[69vh]',
          'flex flex-col-reverse space-y-4 overflow-y-auto p-4'
        )}
      >
        <div ref={endOfMessagesRef} />
        {messages.map((message) => (
          <Messages key={message.id} message={message} />
        ))}
      </div>
      <Composer conversation={selectedConversation} />
    </div>
  );
};

export default memo(MessagesList);