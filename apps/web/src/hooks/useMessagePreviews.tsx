import type { Profile } from '@lensshare/lens';
import { useProfilesLazyQuery } from '@lensshare/lens';

import { resolveEns } from '@lib/resolveEns';
import type { Conversation } from '@xmtp/xmtp-js';
import { DecodedMessage } from '@xmtp/xmtp-js';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import useXmtpClient from 'src/hooks/useXmtpClient';
import { useAppStore } from 'src/store/useAppStore';
import { useMessageStore } from 'src/store/message';

import { useMessageDb } from './useMessageDb';
import { useStreamAllMessages } from './useStreamAllMessages';
import { useStreamConversations } from './useStreamConversations';
import { buildConversationKey, parseConversationKey } from './conversationKey';
import chunkArray from './chunkArray';
import buildConversationId from './buildConversationId';

const MAX_PROFILES_PER_REQUEST = 50;

const useMessagePreviews = () => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const conversations = useMessageStore((state) => state.conversations);
  const setConversations = useMessageStore((state) => state.setConversations);
  const previewMessages = useMessageStore((state) => state.previewMessages);
  const selectedProfileId = useMessageStore((state) => state.selectedProfileId);
  const setPreviewMessages = useMessageStore(
    (state) => state.setPreviewMessages
  );
  const setSelectedProfileId = useMessageStore(
    (state) => state.setSelectedProfileId
  );
  const reset = useMessageStore((state) => state.reset);
  const syncedProfiles = useMessageStore((state) => state.syncedProfiles);
  const addSyncedProfiles = useMessageStore((state) => state.addSyncedProfiles);
  const { client, loading: creatingXmtpClient } = useXmtpClient();
  const [profileIds, setProfileIds] = useState<Set<string>>(new Set<string>());
  const [nonLensProfiles, setNonLensProfiles] = useState<Set<string>>(
    new Set<string>()
  );

  const [messagesLoading, setMessagesLoading] = useState<boolean>(true);
  const [profilesLoading, setProfilesLoading] = useState<boolean>(true);
  const [profilesError, setProfilesError] = useState<Error | undefined>();
  const [loadProfiles] = useProfilesLazyQuery();
  const setEnsNames = useMessageStore((state) => state.setEnsNames);
  const [profilesToShow, setProfilesToShow] = useState<Map<string, Profile>>(
    new Map()
  );

  const {
    persistPreviewMessage,
    previewMessages: rawPreviewMessages,
    messageProfiles,
    batchPersistProfiles
  } = useMessageDb();

  const getProfileFromKey = useCallback(
    (key: string): string | null => {
      const parsed = parseConversationKey(key);
      const userProfileId = currentProfile?.id;
      if (!parsed || !userProfileId) {
        return null;
      }

      return parsed.members.find((member) => member !== userProfileId) ?? null;
    },
    [currentProfile?.id]
  );

  useEffect(() => {
    const mapPreviewMessages = async () => {
      if (!client || !rawPreviewMessages) {
        return;
      }
      const newPreviewMessages = new Map(previewMessages);
      for (const msg of rawPreviewMessages) {
        const existing = newPreviewMessages.get(msg.conversationKey);
        // Only update the cache if the new messsage is newer
        if (!existing || msg.sent > existing.sent) {
          const message = await DecodedMessage.fromBytes(
            msg.messageBytes,
            client
          );
          const { conversationKey } = msg;
          newPreviewMessages.set(conversationKey, message);
        }
      }
      setPreviewMessages(newPreviewMessages);
    };

    mapPreviewMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, rawPreviewMessages]);

  useEffect(() => {
    const getEns = async () => {
      const chunks = chunkArray(
        Array.from(nonLensProfiles),
        MAX_PROFILES_PER_REQUEST
      );
      let newEnsNames = new Map();
      for (const chunk of chunks) {
        const ensResponse = await resolveEns(chunk);
        const ensNamesData = ensResponse.data;
        let i = 0;
        for (const ensName of ensNamesData) {
          if (ensName !== '') {
            newEnsNames.set(chunk[i], ensName);
          }
          i++;
        }
      }
      setEnsNames(new Map(newEnsNames));
    };
    getEns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonLensProfiles]);

  useEffect(() => {
    const toQuery = new Set(profileIds);
    for (const synced of syncedProfiles) {
      toQuery.delete(synced);
    }

    if (!toQuery.size) {
      setProfilesLoading(false);
      return;
    }

    const loadLatest = async () => {
      setProfilesLoading(true);

      const chunks = chunkArray(Array.from(toQuery), MAX_PROFILES_PER_REQUEST);
      try {
        for (const chunk of chunks) {
          const newMessageProfiles = new Map<string, Profile>();
          const result = await loadProfiles({
            variables: { request: { where: { profileIds: chunk } } }
          });

          if (!result.data?.profiles.items.length) {
            continue;
          }

          const profiles = result.data.profiles.items as Profile[];
          for (const profile of profiles) {
            const peerAddress = profile.ownedBy.address as string;
            const key = buildConversationKey(
              peerAddress,
              buildConversationId(currentProfile?.id, profile.id)
            );
            newMessageProfiles.set(key, profile);
          }
          batchPersistProfiles(newMessageProfiles);
          addSyncedProfiles(chunk);
        }
      } catch (error: unknown) {
        setProfilesError(error as Error);
      }

      setProfilesLoading(false);
    };
    loadLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileIds, syncedProfiles]);

  useEffect(() => {
    if (!client || !currentProfile) {
      return;
    }

    const listConversations = async () => {
      setMessagesLoading(true);
      const newConversations = new Map(conversations);
      const newProfileIds = new Set(profileIds);
      const newNonLensProfiles = new Set(nonLensProfiles);
      const convos = await client.conversations.list();

      for (const convo of convos) {
        const key = buildConversationKey(
          convo.peerAddress,
          (convo.context?.conversationId as string) ?? ''
        );
        const profileId = getProfileFromKey(key);

        if (profileId) {
          newProfileIds.add(profileId);
        } else {
          newNonLensProfiles.add(key);
        }
        newConversations.set(key, convo);
      }

      setConversations(newConversations);

      if (newProfileIds.size > profileIds.size) {
        setProfileIds(newProfileIds);
      }

      if (newNonLensProfiles.size > nonLensProfiles.size) {
        setNonLensProfiles(newNonLensProfiles);
      }

      setMessagesLoading(false);
    };

    listConversations();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, currentProfile?.id, selectedProfileId]);

  const onMessage = useCallback(
    (message: DecodedMessage) => {
      const conversationId = message.conversation.context?.conversationId;

      const key = buildConversationKey(
        message.conversation.peerAddress,
        conversationId ?? ''
      );
      persistPreviewMessage(key, message);
    },
    [persistPreviewMessage]
  );

  useStreamAllMessages(onMessage);

  const onConversation = useCallback(
    (convo: Conversation) => {
      const newConversations = new Map(conversations);
      const newProfileIds = new Set(profileIds);
      const newNonLensProfiles = new Set(nonLensProfiles);
      const key = buildConversationKey(
        convo.peerAddress,
        convo?.context?.conversationId ?? ''
      );
      newConversations.set(key, convo);
      const profileId = getProfileFromKey(key);
      if (profileId && !profileIds.has(profileId)) {
        newProfileIds.add(profileId);
        setProfileIds(newProfileIds);
      } else {
        newNonLensProfiles.add(key);
        setNonLensProfiles(newNonLensProfiles);
      }
      setConversations(newConversations);
    },
    [
      conversations,
      getProfileFromKey,
      nonLensProfiles,
      profileIds,
      setConversations
    ]
  );

  useStreamConversations(onConversation);

  useEffect(() => {
    if (selectedProfileId && currentProfile?.id !== selectedProfileId) {
      reset();
      setSelectedProfileId(currentProfile?.id);
      router.push('/messages');
    } else {
      setSelectedProfileId(currentProfile?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  useEffect(() => {
    const otherProfiles = new Map();
    Array.from(nonLensProfiles).map((key) => {
      otherProfiles.set(key, {} as Profile);
    });

    setProfilesToShow(new Map([...(messageProfiles ?? []), ...otherProfiles]));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageProfiles]);

  return {
    authenticating: creatingXmtpClient,
    loading: messagesLoading || profilesLoading || messageProfiles == undefined,
    messages: previewMessages,
    profilesToShow,
    profilesError: profilesError
  };
};

export default useMessagePreviews;
