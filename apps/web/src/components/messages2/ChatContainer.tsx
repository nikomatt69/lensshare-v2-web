/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DisplayedMessage } from '@lib/mapReactionsToMessages';
import type { IMessageIPFSWithCID, Message } from '@pushprotocol/restapi';
import type { Profile } from '@lensshare/lens';
import Loader from '@components/Shared/Loader';
import {
  ArrowUturnLeftIcon,
  InformationCircleIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { PUSH_ENV, STATIC_ASSETS_URL } from '@lensshare/data/constants';
import formatAddress from '@lensshare/lib/formatAddress';
import { Button, Spinner, Image } from '@lensshare/ui';
import { transformMessages } from '@lib/mapReactionsToMessages';
import { chat } from '@pushprotocol/restapi';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import clsx from 'clsx';
import { formatRelative } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import useMessageStore from 'src/store/useMessageStore2';
import { useWalletClient } from 'wagmi';

import ChatReactionPopover from './ChatReactionPopover';
import ChatMessageInput from './Input';
import RenderMessage from './RenderMessage';
import RenderReplyMessage from './RenderReplyMessage';
import Follow from '@components/Shared/Profile/Follow';
import Unfollow from '@components/Shared/Profile/Unfollow';
import getStampFyiURL from '@lensshare/lib/getStampFyiURL';
import Link from 'next/link';
import router from 'next/router';
import { useAppStore } from 'src/store/useAppStore';
import usePushVideoCall from './Video/usePushVideoCall';

type SavedQueryData = {
  pageParams: string[];
  pages: IMessageIPFSWithCID[][];
};

const ChatListItemContainer = ({
  profile
}: {
  profile: {
    address: string;
    did: string;
    isRequestProfile: boolean;
    name: string;
    threadhash?: string;
  };
}) => {
  const ITEM_LIMIT = 30;
  const { address, threadhash } = profile;

  const pgpPvtKey = useMessageStore((state) => state.pgpPvtKey);
  const { data: signer } = useWalletClient();

  const messageContainerref = useRef<HTMLDivElement | null>(null);

  const baseConfig = useMemo(() => {
    return {
      account: signer?.account.address ?? '',
      env: PUSH_ENV,
      pgpPrivateKey: pgpPvtKey,
      threadhash: profile.threadhash ?? ''
    };
  }, [signer?.account.address, pgpPvtKey, profile.threadhash]);

  const {
    data: historyData,
    fetchNextPage,
    hasNextPage,
    isFetching: isHistoryFetching,
    isFetchingNextPage,
    isLoading: isHistoryLoading
  } = useInfiniteQuery({
    enabled: !!address && !!threadhash,
    getNextPageParam: (_, data) => {
      const flattenData = data.flat(1);
      return flattenData.pop()?.cid;
    },
    getPreviousPageParam: (firstPage: IMessageIPFSWithCID[]) =>
      firstPage?.[0]?.cid,
    initialPageParam: threadhash ?? '',
    queryFn: async ({ pageParam }: { pageParam: string }) => {
      if (!pageParam) {
        return [];
      }
      const history =
        ((await chat.history({
          ...baseConfig,
          limit: ITEM_LIMIT,
          threadhash: pageParam,
          toDecrypt: true
        })) as unknown as IMessageIPFSWithCID[]) ?? [];

      return history;
    },
    queryKey: ['fetch-messages', profile.did],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10
  });

  const isMessagesLoading = isHistoryFetching && !isHistoryLoading;
  const messages = transformMessages(
    historyData?.pages.flatMap((page) => [...page]) ?? []
  );

  const queryClient = useQueryClient();

  const { isPending: isSendingMessage, mutateAsync: sendMessage } = useMutation(
    {
      mutationFn: async (message: Message) => {
        if (!signer) {
          return;
        }

        if (!message) {
          return;
        }

        return await chat.send({
          account: signer?.account.address ?? '',
          env: PUSH_ENV,
          message: message,
          pgpPrivateKey: pgpPvtKey,
          signer: signer,
          to: profile.address
        });
      },
      mutationKey: ['send-message'],
      // onError: async (error, newMessage, { previousMessages }) => {
      //   // const queryKey = ['fetch-messages', profile.did];
      //   // queryClient.setQueryData(queryKey, previousMessages);
      // },
      onMutate: async (message) => {
        const queryKey = ['fetch-messages', profile.did];
        await queryClient.cancelQueries({ queryKey });

        const previousMessages = queryClient.getQueryData(
          queryKey
        ) as SavedQueryData;
        const newMessage: IMessageIPFSWithCID & { isOptimistic?: boolean } = {
          cid: '',
          encryptedSecret: null,
          encType: 'pgp',
          fromCAIP10: `eip155:${signer?.account.address}`,
          fromDID: `eip155:${signer?.account.address}`,
          isOptimistic: true,
          link: '',
          messageContent:
            typeof message.content === 'string'
              ? message.content
              : 'Not Supported Content',
          messageObj: message,
          messageType: message.type as any,
          signature: '',
          sigType: '',
          timestamp: Date.now(),
          toCAIP10: profile.did,
          toDID: profile.did
        };
        queryClient.setQueryData(queryKey, (old: SavedQueryData) => {
          old?.pages?.[0].unshift(newMessage as any);
          return old;
        });

        return { newMessage: newMessage, previousMessages };
      },
      onSettled: async (data, error, newMessage, context) => {
        if (!context) {
          return;
        }
        const queryKey = ['fetch-messages', profile.did];
        if (error) {
          queryClient.setQueryData(queryKey, context.previousMessages);
          return;
        }

        queryClient.setQueryData(queryKey, (old: SavedQueryData) => {
          if (!data) {
            return;
          }
          const pagesData = old?.pages?.[0];
          if (!pagesData) {
            return;
          }
          const updatedMessageIndex = pagesData.indexOf(context.newMessage);
          if (updatedMessageIndex < 0) {
            return;
          }
          delete data.messageObj;
          delete context.newMessage.isOptimistic;
          pagesData[updatedMessageIndex] = {
            ...context.newMessage,
            ...data,
            messageContent: context.newMessage.messageContent
          };
          return old;
        });
      }
    }
  );
  const currentProfile = useAppStore((state) => state.currentProfile);

  const address2 = profile as unknown as Profile;

  const { isPending: isApproving, mutateAsync: onApprove } = useMutation({
    mutationFn: async (_did: string) => {
      return true;
    },
    mutationKey: ['approve-user']
  });

  const { isPending: isRejecting, mutateAsync: onReject } = useMutation({
    mutationFn: async (_did: string) => {
      return true;
    },
    mutationKey: ['approve-user']
  });

  const [replyMessage, setReplyMessage] = useState<DisplayedMessage | null>(
    null
  );

  const onSendMessage = useCallback(
    async (message: string) => {
      if (!message) {
        return;
      }
      if (!replyMessage) {
        await sendMessage({ content: message, type: 'Text' });
      } else {
        await sendMessage({
          content: { content: message, type: 'Text' },
          reference: replyMessage.link,
          type: 'Reply'
        });
      }
      setReplyMessage(null);
    },
    [replyMessage, sendMessage]
  );

  const onSendAttachment = useCallback(
    async (file: File) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async (event) => {
        const result = event.target?.result;
        if (!result || typeof result !== 'string') {
          return;
        }
        await sendMessage({
          content: result,
          type: 'Image'
        });
      };
    },
    [sendMessage]
  );

  const onRemoveReplyMessage = useCallback(() => {
    setReplyMessage(null);
  }, []);

  useEffect(() => {
    // Scroll to the latest messages
    if (
      !isMessagesLoading &&
      messages?.length !== 0 &&
      messageContainerref.current
    ) {
      messageContainerref.current.scrollTop =
        messageContainerref.current.scrollHeight;
    }
  }, [messages, isMessagesLoading, messageContainerref]);

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [following, setFollowing] = useState(true);

  const [show, setShow] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');

  const setFollowingWrapped = useCallback(
    (following: boolean) => {
      setFollowing(following);
    },
    [setFollowing]
  );

  const { setRequestVideoCall } = usePushVideoCall();

  return (
    <div className="border-brand-700 mt-3 flex h-[-webkit-calc(86vh-5.5rem)] w-full flex-col justify-between rounded-xl border-2 dark:bg-gray-800 md:h-[-webkit-calc(100vh-5.5rem)] lg:h-[-webkit-calc(100vh-5.5rem)]">
      <div className="m-3 flex items-center justify-between bg-white dark:bg-gray-800">
        <Image
          className="mr-4 h-10 w-10 cursor-pointer rounded-full border dark:border-gray-700"
          src={getStampFyiURL(profile.address) ?? address2}
        />
       
        <span>
          <h3 className="mr-6 text-base font-semibold leading-6 text-gray-900 dark:bg-gray-800 dark:text-white">
            {profile.name
              ? formatAddress(profile.address)
              : formatAddress(profile.address)}
          </h3>
        </span>
        <img
          src={`${STATIC_ASSETS_URL}/images/camera-video.svg`}
          onClick={async () => {
            const apiCall = await fetch('/api/create-room', {
              mode: 'no-cors',
              method: 'POST',
              body: JSON.stringify({
                title: 'LensShare-Space'
              }),
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'wWUkmfVYqMCcYLKEGA8VE1fZ4hWyo5d0' || ''
              }
            });
            const data = (await apiCall.json()) as {
              data: { roomId: string };
            };
            const { roomId } = data.data;
            const currentUrl = window.location.href;
            const url = currentUrl.match(/^https?:\/\/([^/]+)/)?.[0];
            const meetingUrl = `${url}/meet/${roomId}`;
            onSendMessage(`VideoCall url : lenshareapp.xyz/meet/${roomId}`);

            // Instead of sending a message, set the meeting URL in the state

            // Instead of sending a message, set the meeting URL in the state
            setShow(true);
            setMeetingUrl(meetingUrl);
            router.push(`${url}/meet/${roomId}`);
          }}
          className="text-brand-700 ml-2 inline h-8 w-8 cursor-pointer"
        />
        <div className="mx-2 mt-2 ">
          {show && (
            <Link href={meetingUrl}>
              <PhoneIcon className="h-6 w-6 text-green-500" />
            </Link>
          )}
        </div>
        {profile.address ? (
          <div>
            {!following ? (
              <Follow
                profile={currentProfile as Profile}
                setFollowing={setFollowingWrapped}
              />
            ) : (
              <Unfollow
                profile={currentProfile as Profile}
                setFollowing={setFollowingWrapped}
              />
            )}
          </div>
        ) : null}
        <InformationCircleIcon
          aria-hidden="true"
          className="h-5 w-5 text-[#1d4ed8]"
        />
      </div>
      <div className="w-full border-b-[1px]" />
      <div
        className="h-screen space-y-3 overflow-y-scroll px-4 py-2"
        ref={messageContainerref}
      >
        {isHistoryFetching && !isFetchingNextPage && (
          <div className="flex h-full items-center justify-center">
            <Loader message="Loading messages..." />
          </div>
        )}

        <Virtuoso
          components={{
            Header: () => {
              if (hasNextPage && isFetchingNextPage) {
                return (
                  <div className="flex h-full items-center justify-center">
                    <Loader message="Loading more messages..." />
                  </div>
                );
              }
            }
          }}
          data={messages}
          firstItemIndex={
            messages.length - ITEM_LIMIT < 0
              ? 10000
              : messages.length - ITEM_LIMIT
          }
          initialTopMostItemIndex={ITEM_LIMIT - 1}
          itemContent={(_, message) => {
            const isMessageFromProfile = message.from !== profile.address;
            if (!message.messageObj) {
              return '';
            }

            return (
              <div
                className={`group flex items-center gap-1 text-xs ${
                  isMessageFromProfile ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className="max-w-[75%]">
                  <div
                    className={clsx(
                      'text-wrap my-2 rounded-2xl px-4 py-2 text-xs',
                      {
                        'bg-gray-300 dark:text-black': !isMessageFromProfile,
                        'opacity-80': message.isOptimistic,
                        'rounded-br-md bg-[#1d4ed8] text-white ':
                          isMessageFromProfile
                      }
                    )}
                  >
                    {message.messageType !== MessageType.REPLY && (
                      <RenderMessage key={message.link} message={message} />
                    )}
                    {message.messageType === MessageType.REPLY && (
                      <RenderReplyMessage message={message as unknown as any} />
                    )}
                    {message.timestamp && (
                      <sub className="ml-3 text-right font-sans text-xs">
                        {formatRelative(message.timestamp, new Date())}
                      </sub>
                    )}
                  </div>
                  {message.reactions && (
                    <div className="float-right -mt-2 flex gap-1">
                      {message.reactions.map((reaction, index) => (
                        <span
                          className="h-6 w-6 rounded-full bg-[#1d4ed8] bg-opacity-20 text-center"
                          key={index}
                        >
                          {reaction}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="hidden group-hover:block">
                  <ChatReactionPopover
                    reactions={message.reactions}
                    recipientAddress={profile.address}
                    reference={message.link}
                  />
                </div>
                <div
                  className="hidden cursor-pointer group-hover:block"
                  onClick={() => setReplyMessage(message)}
                  role="button"
                >
                  <ArrowUturnLeftIcon
                    aria-hidden="true"
                    className="h-5 w-5 opacity-100 transition duration-150 ease-in-out"
                  />
                </div>
              </div>
            );
          }}
          ref={virtuosoRef}
          startReached={async () => {
            await fetchNextPage();
            return false;
          }}
        />
      </div>
      <ChatMessageInput
        
        onRemoveReplyMessage={onRemoveReplyMessage}
        onSend={(message) => {
          onSendMessage(message);
          // scroll to the latest
          virtuosoRef.current?.scrollToIndex?.({
            align: 'end',
            index: messages.length + 1
          });
        }}
        onSendAttachment={onSendAttachment}
        replyMessage={replyMessage}
      />
    </div>
  );
};

export default ChatListItemContainer;
