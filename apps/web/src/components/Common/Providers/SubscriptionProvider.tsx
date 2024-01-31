
import { API_URL } from '@lensshare/data/constants';
import type { UserSigNonces, Notification } from '@lensshare/lens';
import { useApolloClient } from '@lensshare/lens/apollo';
import {
  AuthorizationRecordRevokedSubscriptionDocument,
  NewNotificationSubscriptionDocument,
  UserSigNoncesSubscriptionDocument
} from '@lensshare/lens/generated2';
import getCurrentSessionId from '@lib/getCurrentSessionId';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';

import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { signOut } from 'src/store/useAuthPersistStore';
import { useNonceStore } from 'src/store/useNonceStore';
import { useNotificationPersistStore } from 'src/store/useNotificationPersistStore';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

const SubscriptionProvider = () => {
  const { address } = useAccount();
  const { setLensHubOnchainSigNonce } = useNonceStore();
  const { resetStore: resetApolloStore } = useApolloClient();
  const currentSessionProfileId = getCurrentSessionProfileId();

  const setLatestNotificationId = useNotificationPersistStore(
    (state) => state.setLatestNotificationId
  );

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    API_URL.replace('http', 'ws'),
    { protocols: ['graphql-ws'] }
  );

  useEffect(() => {
    sendJsonMessage({ type: 'connection_init' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  useEffect(() => {
    if (readyState === 1 && currentSessionProfileId) {
      if (!isAddress(currentSessionProfileId)) {
        sendJsonMessage({
          id: '1',
          type: 'subscribe',
          payload: {
            variables: { for: currentSessionProfileId },
            query: NewNotificationSubscriptionDocument.loc?.source.body
          }
        });
      }
      sendJsonMessage({
        id: '2',
        type: 'subscribe',
        payload: {
          variables: { address },
          query: UserSigNoncesSubscriptionDocument.loc?.source.body
        }
      });
      sendJsonMessage({
        id: '3',
        type: 'subscribe',
        payload: {
          variables: { authorizationId: getCurrentSessionId() },
          query: AuthorizationRecordRevokedSubscriptionDocument.loc?.source.body
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyState, currentSessionProfileId]);

  useEffect(() => {
    const jsonData = JSON.parse(lastMessage?.data || '{}');
    const data = jsonData?.payload?.data;

    if (currentSessionProfileId && data) {
      if (jsonData.id === '1') {
        const notification = data.newNotification as Notification;
        if (notification) {
          setLatestNotificationId(notification?.id);
        }
      }
      if (jsonData.id === '2') {
        const userSigNonces = data.userSigNonces as UserSigNonces;
        if (userSigNonces) {
          setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce);
        }
      }
      if (jsonData.id === '3') {
        signOut();
        resetApolloStore();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage, currentSessionProfileId]);

  return null;
};

export default SubscriptionProvider;
