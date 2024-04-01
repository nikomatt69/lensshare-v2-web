import type { CachedConversation } from '@xmtp/react-sdk';
import type { FC } from 'react';

import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import cn from '@lensshare/ui/cn';
import {
  useClient,
  useConsent,
  useConversations,
  useStreamAllMessages
} from '@xmtp/react-sdk';
import { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import * as Collapsible from '@radix-ui/react-collapsible';
import Conversation from './Conversation';
import EnableMessages from './EnableMessages';
import NewConversation from './NewConversation';
import ConversationsShimmer from './Shimmer';
import * as React from 'react';

interface ConversationsProps {
  isClientLoading: boolean;
}

const Conversations: FC<ConversationsProps> = ({ isClientLoading }) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'requests'>(
    'messages'
  );
  const [requestsCount, setRequestsCount] = useState(0);
  const [filteredConversations, setFilteredConversations] = useState<
    CachedConversation[]
  >([]);
  const [visibleConversations, setVisibleConversations] = useState<
    CachedConversation[]
  >([]);
  const [page, setPage] = useState(1);

  const { client } = useClient();
  const { conversations, isLoading } = useConversations();
  const { consentState, isAllowed, loadConsentList } = useConsent();
  const conversationsPerPage = 20;

  const getActiveConversations = async () => {
    const active = await Promise.all(
      conversations.map(async (conversation) => {
        if (
          activeTab === 'messages' &&
          (await isAllowed(conversation.peerAddress))
        ) {
          return conversation;
        }

        if (
          activeTab === 'requests' &&
          (await consentState(conversation.peerAddress)) === 'unknown'
        ) {
          return conversation;
        }

        return null;
      })
    );

    setRequestsCount(active.filter((c) => !c).length);
    setFilteredConversations(active.filter(Boolean) as CachedConversation[]);
  };

  useEffect(() => {
    getActiveConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, conversations]);

  useEffect(() => {
    if (client) {
      loadConsentList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const end = page * conversationsPerPage;
    const newConversations = filteredConversations.slice(0, end);
    setVisibleConversations(newConversations);
  }, [page, filteredConversations]);
  const [open, setOpen] = React.useState(false);

  useStreamAllMessages();
  return (
    <Collapsible.Root
      className="inline-flex-col m-1 mx-auto w-[screen]  items-center justify-between rounded-xl border-0 dark:bg-black"
      open={open}
      onOpenChange={setOpen}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'dark:bg-black',
          borderRadius: '12',
          border: '0',
          borderWidth: '0'
        }}
      >
        <span
          className="text-brand-500 rounded-xl border-0 p-2 text-[15px] leading-[25px]"
          style={{ color: 'white' }}
        />
        <Collapsible.Trigger asChild>
          <button className="mx-auto items-center justify-between rounded-xl border border-gray-900 p-2 dark:bg-gray-800/80  dark:text-gray-200">
            {open ? 'Hide Chats' : 'Show Chats'}
          </button>
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        <div>
          <NewConversation />
          <div className="divider" />
          <button
            className={cn(
              {
                'rounded-xl bg-gray-100 dark:bg-black': activeTab === 'requests'
              },
              'hover:bg-gray-100 hover:dark:bg-black',
              'mx-auto flex max-h-screen w-full items-center space-x-2 rounded-xl px-2 py-3'
            )}
            onClick={() =>
              setActiveTab(activeTab === 'messages' ? 'requests' : 'messages')
            }
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border dark:border-gray-700">
              {activeTab === 'messages' ? (
                <EnvelopeIcon className="h-5 w-5" />
              ) : (
                <ArrowLeftIcon className="h-5 w-5" />
              )}
            </div>
            <div className="flex flex-col items-start space-y-1 rounded-xl">
              <div className="font-bold">
                {activeTab === 'messages' ? 'Message Requests' : 'Messages'}
              </div>
              <div className="ld-text-gray-500 text-sm">
                {requestsCount}{' '}
                {activeTab === 'messages' ? 'new requests' : 'messages'}
              </div>
            </div>
          </button>
          <div className={cn('h-[82.5vh] max-h-[82.5vh]')}>
            {isClientLoading || isLoading ? (
              <ConversationsShimmer />
            ) : !client?.address ? (
              <EnableMessages />
            ) : (
              <Virtuoso
                computeItemKey={(_, conversation) =>
                  `${conversation.id}-${conversation.peerAddress}`
                }
                data={visibleConversations}
                endReached={() => {
                  setTimeout(() => {
                    setPage((prevPage) => prevPage + 1);
                  }, 1000);
                }}
                itemContent={(_, conversation) => {
                  return <Conversation conversation={conversation} />;
                }}
              />
            )}
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default Conversations;
