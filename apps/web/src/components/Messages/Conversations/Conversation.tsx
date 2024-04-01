import { useStreamAllMessages, type CachedConversation } from '@xmtp/react-sdk';
import type { FC } from 'react';
import type { Address } from 'viem';


import cn from '@lensshare/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';

import User from './User';
import React from 'react';

interface ConversationProps {
  conversation: CachedConversation;
}

const Conversation: FC<ConversationProps> = ({ conversation }) => {
  const {
    selectedConversation,
    setNewConversationAddress,
    setSelectedConversation
  } = useMessagesStore();
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className={cn(
        {
          'bg-gray-100 dark:bg-gray-800':
            selectedConversation?.id === conversation.id
        },
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'cursor-pointer px-5 py-3'
      )}
      onClick={() => {
        setNewConversationAddress(null);
        setSelectedConversation(conversation);
        setOpen(false)

  ;
      }}
    >
      <User
        address={conversation.peerAddress as Address}
        conversation={conversation}
      />
    </div>
  );
};

export default Conversation;
