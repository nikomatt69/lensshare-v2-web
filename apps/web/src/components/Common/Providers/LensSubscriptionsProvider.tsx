import type { Notification }  from '@lensshare/lens';
import {
  useAuthorizationRecordRevokedSubscriptionSubscription,
  useNewNotificationSubscriptionSubscription,
  useUserSigNoncesQuery,
  useUserSigNoncesSubscriptionSubscription
} from '@lensshare/lens';

import { BrowserPush } from '@lib/browserPush';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import getPushNotificationData from '@lib/getPushNotificationData';
import { useEffect, type FC } from 'react';
import { isSupported, share } from 'shared-zustand';
import { signOut } from 'src/store/useAuthPersistStore';
import { useNonceStore } from 'src/store/useNonceStore';
import { useUpdateEffect } from 'usehooks-ts';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';
import { useNotificationStore } from 'src/store/persisted/useNotificationStore';
import getCurrentSession from '@lib/getCurrentSession';

const LensSubscriptionsProvider: FC = () => {
  const { setLatestNotificationId } = useNotificationStore();
  const { setLensHubOnchainSigNonce } = useNonceStore();
  const { address } = useAccount();
  const { id: sessionProfileId } = getCurrentSession();
  const canUseSubscriptions = Boolean(sessionProfileId) && address;

  // Begin: New Notification
  const { data: newNotificationData } =
    useNewNotificationSubscriptionSubscription({
      skip: !canUseSubscriptions,
      variables: { for: sessionProfileId }
    });

  useEffect(() => {
    const notification = newNotificationData?.newNotification as Notification;

    if (notification) {
      if (notification && getPushNotificationData(notification)) {
        const notify = getPushNotificationData(notification);
        BrowserPush.notify({ title: notify?.title || '' });
      }
      setLatestNotificationId(notification?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newNotificationData]);
  // End: New Notification

  // Begin: User Sig Nonces
  const { data: userSigNoncesData } = useUserSigNoncesSubscriptionSubscription({
    skip: !canUseSubscriptions,
    variables: { address }
  });

  useEffect(() => {
    const userSigNonces = userSigNoncesData?.userSigNonces;

    if (userSigNonces) {
      setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSigNoncesData]);
  // End: User Sig Nonces

  return null;
};

export default LensSubscriptionsProvider;