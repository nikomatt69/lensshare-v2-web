import {
  type Notification,
  useNewNotificationSubscriptionSubscription,
  useUserSigNoncesSubscriptionSubscription,
  useAuthorizationRecordRevokedSubscriptionSubscription,
  useUserSigNoncesQuery
} from '@lensshare/lens/generated2';
import { BrowserPush } from '@lib/browserPush';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import getPushNotificationData from '@lib/getPushNotificationData';
import type { FC } from 'react';
import { isSupported, share } from 'shared-zustand';
import { signOut } from 'src/store/useAuthPersistStore';
import { useNonceStore } from 'src/store/useNonceStore';
import { useNotificationPersistStore } from 'src/store/useNotificationPersistStore';
import { useUpdateEffect } from 'usehooks-ts';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

const LensSubscriptionsProvider: FC = () => {
  const setLatestNotificationId = useNotificationPersistStore(
    (state) => state.setLatestNotificationId
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );
  const setLensPublicActProxyOnchainSigNonce = useNonceStore(
    (state) => state.setLensPublicActProxyOnchainSigNonce
  );
  const { address } = useAccount();
  const currentSessionProfileId = getCurrentSessionProfileId();
  const canUseSubscriptions = Boolean(currentSessionProfileId) && address;

  // Begin: New Notification
  const { data: newNotificationData } =
    useNewNotificationSubscriptionSubscription({
      variables: { for: currentSessionProfileId },
      skip: !canUseSubscriptions || isAddress(currentSessionProfileId)
     
    });

  useUpdateEffect(() => {
    const notification = newNotificationData?.newNotification as Notification;

    if (notification) {
      if (notification && getPushNotificationData(notification)) {
        const notify = getPushNotificationData(notification);
        BrowserPush.notify({ title: notify?.title || '' });
      }
      setLatestNotificationId(notification?.id);
    }
  }, [newNotificationData]);
  // End: New Notification

  // Begin: User Sig Nonces
  const { data: userSigNoncesData } = useUserSigNoncesSubscriptionSubscription({
    variables: { address },
    skip: !canUseSubscriptions
  });

  useUpdateEffect(() => {
    const userSigNonces = userSigNoncesData?.userSigNonces;

    if (userSigNonces) {
      setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce);
      setLensPublicActProxyOnchainSigNonce(
        userSigNonces.lensPublicActProxyOnchainSigNonce
      );
    }
  }, [userSigNoncesData]);
  // End: User Sig Nonces

  // Begin: Authorization Record Revoked
  const { data: authorizationRecordRevokedData } =
    useAuthorizationRecordRevokedSubscriptionSubscription({
      variables: { authorizationId: currentSessionProfileId },
      skip: !canUseSubscriptions
    });

  useUpdateEffect(() => {
    const authorizationRecordRevoked =
      authorizationRecordRevokedData?.authorizationRecordRevoked;

    // Using not null assertion because api returns null if revoked
    if (!authorizationRecordRevoked) {
      signOut();
      location.reload();
    }
  }, [authorizationRecordRevokedData]);
  // End: Authorization Record Revoked

  useUserSigNoncesQuery({
    onCompleted: (data) => {
      setLensPublicActProxyOnchainSigNonce(
        data.userSigNonces.lensPublicActProxyOnchainSigNonce
      );
    },
    skip: Boolean(currentSessionProfileId)
      ? !isAddress(currentSessionProfileId)
      : true
  });

  // Sync zustand stores between tabs
  if (isSupported()) {
    share('lensHubOnchainSigNonce', useNonceStore);
    share('lensPublicActProxyOnchainSigNonce', useNonceStore);
  }

  return null;
};

export default LensSubscriptionsProvider;
