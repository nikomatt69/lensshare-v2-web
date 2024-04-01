/* eslint-disable react-hooks/rules-of-hooks */
import type { CachedConversation, CachedMessageWithId } from '@xmtp/react-sdk';
import type { Address } from 'viem';

import cn from '@lensshare/ui/cn';
import {
  useMessages,
  useStreamAllMessages,
  useStreamMessages
} from '@xmtp/react-sdk';
import { type FC, useEffect, useRef, useState, useCallback } from 'react';

import Composer from '../Composer';
import Consent from './Consent';
import Messages from './Message';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';
import LazyDefaultProfile from '@components/Shared/LazyDefaultProfile';
import useSendMessage from 'src/hooks/useSendMessage';

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
  const [streamedMessages, setStreamedMessages] = useState<
    CachedMessageWithId[]
  >([]);

  // callback to handle incoming messages
  const onMessage = useCallback((message: CachedMessageWithId) => {
    setStreamedMessages((prev) => [...prev, message]);
  }, []);

  useStreamMessages(selectedConversation);
  useStreamMessages(selectedConversation);
  useStreamAllMessages();

  // eslint-disable-next-line react-hooks/rules-of-hooks

  const [show, setShow] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');
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
        className={cn(
          'h-[69vh] max-h-[69vh]',
          'flex flex-col-reverse space-y-4 overflow-y-auto p-4'
        )}
      >
        <div ref={endOfMessagesRef} />
        {[...messages, ...streamedMessages].reverse().map((message) => (
          <Messages key={message.id} message={message} />
        ))}
      </div>
      <Composer conversation={selectedConversation} />
    </div>
  );
};

export default MessagesList;
