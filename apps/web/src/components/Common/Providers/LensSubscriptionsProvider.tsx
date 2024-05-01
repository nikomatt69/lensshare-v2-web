import type { Notification } from '@lensshare/lens';
import {
  useNewNotificationSubscriptionSubscription,
  useUserSigNoncesSubscriptionSubscription
} from '@lensshare/lens';

import { BrowserPush } from '@lib/browserPush';
import getPushNotificationData from '@lib/getPushNotificationData';
import { useEffect, type FC } from 'react';

import { useAccount } from 'wagmi';
import { useNotificationStore } from 'src/store/persisted/useNotificationStore';
import getCurrentSession from '@lib/getCurrentSession';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { subscribeUserToPush } from '@lib/notification';

const LensSubscriptionsProvider: FC = () => {
  const { setLatestNotificationId } = useNotificationStore();
  const { setLensHubOnchainSigNonce } = useNonceStore();
  const { address } = useAccount();
  const { id: sessionProfileId } = getCurrentSession();
  const canUseSubscriptions = Boolean(sessionProfileId) && address;

  // Handle new notifications
  const { data: newNotificationData } = useNewNotificationSubscriptionSubscription({
    skip: !canUseSubscriptions,
    variables: { for: sessionProfileId }
  });

  useEffect(() => {
    if (newNotificationData?.newNotification) {
      const notification = newNotificationData?.newNotification as Notification;
      const notifyData = getPushNotificationData(notification);

      if (notifyData) {
        BrowserPush.notify({ title: notifyData.title || '' }); // Local browser notification
        subscribeUserToPush(async (subscription: any) => {
          console.log('Subscribed with subscription:', subscription); // Log the subscription info (for debugging)
        }).catch(console.error);
      }
      setLatestNotificationId(notification.id);
    }
  }, [newNotificationData, canUseSubscriptions]);

  // Handle signature nonces for on-chain interactions
  const { data: userSigNoncesData } = useUserSigNoncesSubscriptionSubscription({
    skip: !canUseSubscriptions,
    variables: { address }
  });

  useEffect(() => {
    if (userSigNoncesData?.userSigNonces) {
      setLensHubOnchainSigNonce(userSigNoncesData.userSigNonces.lensHubOnchainSigNonce);
    }
  }, [userSigNoncesData, canUseSubscriptions]);

  return null;
};

export default LensSubscriptionsProvider;