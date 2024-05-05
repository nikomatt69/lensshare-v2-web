/* eslint-disable react-hooks/rules-of-hooks */
import type { CachedConversation, CachedMessageWithId } from '@xmtp/react-sdk';
import type { Address } from 'viem';

import {
  useMessages,
  useStreamAllMessages,
  useStreamMessages
} from '@xmtp/react-sdk';
import {  memo , useEffect, useRef, useState } from 'react';
import type { ReactNode, FC } from 'react';

import Composer from '../Composer';
import Consent from './Consent';
import Messages from './Message';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';
import LazyDefaultProfile from '@components/Shared/LazyDefaultProfile';
import useSendMessage from 'src/hooks/useSendMessage';
import { useInView } from 'react-cool-inview';
import { formatDate, isOnSameDay } from 'src/hooks/formatTime5';
import cn from '@lensshare/ui/cn';
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
  const { messages } = useMessages(selectedConversation as CachedConversation);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Void hook, were xmtp/react-sdk stream messages realtime

  const { sendMessage } = useSendMessage(
    selectedConversation?.context?.conversationId as string
  );
  if (!selectedConversation) {
    return null;
  }

  // callback to handle incoming messages
  const stream = useStreamMessages(selectedConversation);

  let lastMessageDate: Date | undefined;
  useEffect(() => {
    endOfMessagesRef.current?.scrollTo(
      0,
      endOfMessagesRef.current.scrollHeight
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);
  const { observe } = useInView({
    onChange: ({ inView }) => {
      if (!inView) {
        return;
      }
      stream;

    }
  });
  // eslint-disable-next-line react-hooks/rules-of-hooks

  useStreamMessages(selectedConversation as CachedConversation);
  const [show, setShow] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');
  return (
    <div >
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
        {[...messages].reverse().map((message) => (
          <Messages key={message.id} message={message} />
        ))}
    
      </div>
      <Composer conversation={selectedConversation} />
    </div>
  );
};

export default memo(MessagesList);;
