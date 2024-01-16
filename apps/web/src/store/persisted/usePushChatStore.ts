import type { IFeeds, IMessageIPFSWithCID, IUser,  video as PushVideo,
  VideoCallData } from '@pushprotocol/restapi';

import { IS_MAINNET } from '@lensshare/data/constants';
import { Localstorage } from '@lensshare/data/storage';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initVideoCallData } from '@pushprotocol/restapi/src/lib/video';
export const PUSH_TABS = {
  CHATS: 'CHATS',
  REQUESTS: 'REQUESTS'
} as const;

export const CHAT_TYPES = {
  CHAT: 'chat'
} as const;

export type ChatTypes = (typeof CHAT_TYPES)[keyof typeof CHAT_TYPES];
export type PushTabs = (typeof PUSH_TABS)[keyof typeof PUSH_TABS];

export const PUSH_ENV = IS_MAINNET ? ENV.PROD : ENV.DEV;

export interface Profile {
  id: string;
  localHandle: string;
  ownedBy: {
    address: string;
  };
  threadHash: null | string;
}

interface IPushChatStore {
  activeReceiptientID: null | string;
  activeTab: PushTabs;
  clearRecipientChat: () => void;
  connectedProfile: IUser | null;
  deleteRequestFeed: (requestId: string) => void;
  mediaEmbedContentTypes: Record<string, null | string>;
  pgpPassword: null | string;
  pgpPrivateKey: null | string;
  recipientChats: [] | IMessageIPFSWithCID[];
  recipientProfile: null | Profile;
  replyToMessage: IMessageIPFSWithCID | null;
  requestsFeed: IFeeds[];
  resetPushChatStore: () => void;
  setActiveTab: (tabName: PushTabs) => void;
  setConnectedProfile: (profile: IUser) => void;
  setMediaEmbedContentType: (type: string, value: null | string) => void;
  setPgpPassword: (password: string) => void;
  setPgpPrivateKey: (pgpPrivateKey: string) => void;
  setRecipientChat: (chat: IMessageIPFSWithCID[], replaceId?: string) => void;
  setRecipientProfile: (profile: Profile) => void;
  setReplyToMessage: (message: IMessageIPFSWithCID | null) => void;
  updateRequestsFeed: (requestsFeed: IFeeds[]) => void;
  videoCallObject: PushVideo.Video | null;
  setVideoCallObject: (videoCallObject: PushVideo.Video | null) => void;
  videoCallData: VideoCallData;
  setVideoCallData: (fn: (data: VideoCallData) => VideoCallData) => void;
}

export const usePushChatStore = create(
  persist<IPushChatStore>(
    (set) => ({
      activeReceiptientID: null,
      activeTab: PUSH_TABS.CHATS,
      clearRecipientChat: () => set(() => ({ recipientChats: [] })),
      connectedProfile: null,
      deleteRequestFeed: (requestID: string) =>
        set((state) => {
          const requestsFeed = state.requestsFeed.filter(
            (feed) => feed.did !== requestID
          );
          return { requestsFeed };
        }),
      mediaEmbedContentTypes: {},
      pgpPassword: null,
      pgpPrivateKey: null,
      recipientChats: [],
      recipientProfile: null,
      replyToMessage: null,
      requestsFeed: [] as IFeeds[],
      resetPushChatStore: () =>
        set((state) => {
          return {
            ...state,
            activeTab: PUSH_TABS.CHATS,
            pgpPassword: null,
            pgpPrivateKey: null,
            recipientProfile: null,
            requestsFeed: []
          };
        }),
      selectedChatType: null,
      setActiveTab: (activeTab) => set(() => ({ activeTab })),
      setConnectedProfile: (connectedProfile) =>
        set(() => ({ connectedProfile })),
      setMediaEmbedContentType: (uri: string, contentType: null | string) =>
        set((state) => ({
          mediaEmbedContentTypes: {
            ...state.mediaEmbedContentTypes,
            [uri]: contentType
          }
        })),
        videoCallObject: null,
  setVideoCallObject: (videoCallObject) => set(() => ({ videoCallObject })),
  videoCallData: initVideoCallData,
  setVideoCallData: (fn) =>
    set((state) => ({ videoCallData: fn(state.videoCallData) })),
      setPgpPassword: (pgpPassword) => set(() => ({ pgpPassword })),
      setPgpPrivateKey: (pgpPrivateKey) => set(() => ({ pgpPrivateKey })),
      setRecipientChat: (chat: IMessageIPFSWithCID[], replaceId?: string) =>
        set((state) => {
          let recipientChats;
          if (replaceId) {
            const index = state.recipientChats.findIndex(
              (item) => item.cid === replaceId
            );
            if (index !== -1) {
              recipientChats = [...state.recipientChats];
              recipientChats[index] = chat[0];
            }
          } else {
            recipientChats = [...state.recipientChats, ...chat];
          }
          return { recipientChats };
        }),
      setRecipientProfile: (receiptientProfile) =>
        set(() => ({ recipientProfile: receiptientProfile })),
      setReplyToMessage: (replyToMessage) => set(() => ({ replyToMessage })),
      setRequestFeed: (id: string, newRequestFeed: IFeeds) => {
        set((state) => {
          const requestsFeed = { ...state.requestsFeed, [id]: newRequestFeed };
          return { requestsFeed };
        });
      },
      updateRequestsFeed: (requestsFeed) =>
        set((state) => ({ ...state, requestsFeed }))
    }),
    {
      name: Localstorage.PushStore
    }
  )
);
