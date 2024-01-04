/* eslint-disable @typescript-eslint/no-unused-vars */
import SearchUser from '@components/Shared/SearchUser';
import { PUSH_ENV } from '@lensshare/data/constants';
import formatAddress from '@lensshare/lib/formatAddress';
import {
  Button,
  GridItemEight,
  GridItemFour,
  GridLayout,
  Image
} from '@lensshare/ui';
import * as Collapsible from '@radix-ui/react-collapsible';
import { chat, user } from '@pushprotocol/restapi';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo, useState } from 'react';
import useMessageStore from 'src/store/useMessageStore2';
import { useAccount, useWalletClient } from 'wagmi';

import ChatListItemContainer from './ChatContainer';
import { ChatShimmer } from './ChatShimmer';
import { getLatestMessagePreviewText } from '@lib/getLatestMessagePreviewText';
import getStampFyiURL from '@lensshare/lib/getStampFyiURL';
import OutgoingCallModal from './Video/OutgoingCallModal';
import IncomingCallModal from './Video/IncomingCallModal';
import Loading from '@components/Shared/Loading';

const ChatView = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<any>();
  const [following, setFollowing] = useState(true);

  const [show, setShow] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');

  const setFollowingWrapped = useCallback(
    (following: boolean) => {
      setFollowing(following);
    },
    [setFollowing]
  );

  const pgpPvtKey = useMessageStore((state) => state.pgpPvtKey);
  const { data: signer } = useWalletClient();

  // Helps to check if the wallet is enabled or not
  const { status } = useAccount();
  const { refresh } = useRouter();

  const baseConfig = useMemo(() => {
    return {
      account: signer?.account.address ?? '',
      env: PUSH_ENV,
      pgpPrivateKey: pgpPvtKey,
      toDecrypt: true
    };
  }, [signer, pgpPvtKey]);

  const { data: chats, isLoading: fetchingChats } = useQuery({
    enabled: !!signer?.account,
    queryFn: async () => {
      return await chat.chats(baseConfig);
    },
    queryKey: ['get-chats']
  });

  const { data: requests, isLoading: fetchingRequests } = useQuery({
    enabled: !!signer?.account,
    queryFn: async () => {
      return await chat.requests(baseConfig);
    },
    queryKey: ['get-pending-requests']
  });

  const [open, setOpen] = React.useState(false);

  const isChatsLoading = fetchingRequests || fetchingChats;

  const allChats = useMemo(() => {
    if (isChatsLoading) {
      return [];
    }

    if (!chats || !requests) {
      return [];
    }

    const requestChats = requests?.map((item) => ({
      ...item,
      type: 'request'
    }));
    const normalChats = chats?.map((item) => ({
      ...item,
      type: 'chat'
    }));
    return (
      [...normalChats, ...requestChats]
        // Filtering groups out
        .filter((each) => !each.groupInformation)
    );
  }, [chats, isChatsLoading, requests]);

  if (status !== 'connected') {
    return (
      <div className="page-center flex flex-col">
        <h2 className="text-2xl">Your wallet is not connected!</h2>
        <p className="my-2 text-sm">
          Please unlock your wallet and refresh the page
        </p>
        <Button onClick={refresh}>Refresh</Button>
      </div>
    );
  }

  if (!isChatsLoading && allChats.length === 0) {
    return (
      <div className="min-w-screen-xl container  flex min-h-[-webkit-calc(86vh-65px)] flex-col items-center justify-center bg-white">
        <h2 className="text-2xl">Didn't chat yet!</h2>
        <p className="text-sm text-gray-500">
          Looks like you haven't started any conversation
        </p>
        <Button className="my-4" size="lg">
          New message
        </Button>
      </div>
    );
  }

  return (
    <GridLayout
      className="  mx-auto my-1 items-center justify-center rounded-xl  bg-white p-0 dark:bg-black"
      classNameChild="mx-auto  items-center justify-center rounded-xl"
    >
      <GridItemFour className=" mx-auto items-center justify-center rounded-xl ">
        {isChatsLoading ? (
          <Loading />
        ) : (
          <div className="rounded-xl bg-slate-200 p-2">
            <SearchUser
              onChange={(event) => setSearchValue(event.target.value)}
              onProfileSelected={async (profile) => {
                const userProfile = await user.get({
                  account: profile.ownedBy.address
                });

                setSelectedProfile({
                  address: userProfile.wallets?.split(':').pop() ?? '',
                  did: userProfile.wallets,
                  handle: userProfile.name,
                  isRequestProfile: false
                });
              }}
              placeholder="Search profiles..."
              value={searchValue}
            />
            <Collapsible.Root
              className="inline-flex-col m-2 mx-auto w-[300px] items-center justify-between"
              open={open}
              onOpenChange={setOpen}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span
                  className="text-violet11 text-[15px] leading-[25px]"
                  style={{ color: 'white' }}
                />
                <Collapsible.Trigger asChild>
                  <button className="mx-auto items-center justify-between dark:text-black">
                    {open ? 'Hide Chats' : 'Show Chats'}
                  </button>
                </Collapsible.Trigger>
              </div>
              <Collapsible.Content>
                {allChats.map((chat) => {
                  const profile = {
                    address: chat.wallets?.split(':').pop() ?? '',
                    did: chat.wallets,
                    handle: chat.name,
                    isRequestProfile: chat.type === 'request',
                    threadhash: chat.threadhash
                  };
                  return (
                    <div
                      className="bg  cursor-pointer p-0.5"
                      key={chat.chatId}
                      onClick={() => {
                        if (
                          !selectedProfile ||
                          selectedProfile.address !== profile.address
                        ) {
                          setSelectedProfile(profile);
                        }
                      }}
                    >
                      <div className="flex rounded-xl p-2 dark:bg-gray-700 dark:text-white">
                        <Image
                          alt={chat.chatId}
                          className="mr-2 h-8 w-8 cursor-pointer rounded-full border dark:border-gray-700"
                          src={
                            getStampFyiURL(profile.address) ??
                            chat.profilePicture
                          }
                        />{' '}
                        <div
                          className=" w-3/4 rounded-xl p-1 dark:bg-gray-700 dark:text-white"
                          key={chat.chatId}
                        >
                          <p className="w-3/4 rounded-xl dark:bg-gray-700 dark:text-white">
                            {chat.name
                              ? chat.name
                              : formatAddress(
                                  chat?.wallets?.split?.(':')?.pop() ?? ''
                                )}
                          </p>
                          <p className="m-1 truncate p-0.5 text-sm text-gray-400">
                            {getLatestMessagePreviewText(chat.msg as any)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Collapsible.Content>
            </Collapsible.Root>
          </div>
        )}
      </GridItemFour>
      <GridItemEight>
        {selectedProfile ? (
          <ChatListItemContainer profile={selectedProfile} />
        ) : (
          <div className="flex min-h-[-webkit-calc(86vh-90px)] flex-col items-center justify-center">
            <h2 className="text-2xl">Select a message</h2>
            <p className="text-sm text-gray-500">
              Choose from your existing conversations, start a new one, or just
              keep swimming.
            </p>
            <Button className="my-4" size="lg">
              New message
            </Button>
          </div>
        )}
      </GridItemEight>
      <OutgoingCallModal />
      <IncomingCallModal />
    </GridLayout>
  );
};

export default ChatView;
