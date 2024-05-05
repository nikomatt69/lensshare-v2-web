import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useNotificationStore } from 'src/store/persisted/useNotificationStore';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import getCurrentSession from '@lib/getCurrentSession';
import getPushNotificationData from '@lib/getPushNotificationData';
import { BrowserPush } from '@lib/browserPush';
import { subscribeUserToPush } from '@lib/notification';
import {
  useNewNotificationSubscriptionSubscription,
  useUserSigNoncesSubscriptionSubscription,
  Notification
} from '@lensshare/lens';

const LensSubscriptionsProvider: React.FC = () => {
  const { setLatestNotificationId } = useNotificationStore();
  const { setLensHubOnchainSigNonce } = useNonceStore();
  const { address } = useAccount();
  const { id: sessionProfileId } = getCurrentSession();
  const canUseSubscriptions = Boolean(sessionProfileId) && address;

  // Subscribe to new notifications from the Lens API
  const { data: newNotificationData } = useNewNotificationSubscriptionSubscription({
    skip: !canUseSubscriptions,
    variables: { for: sessionProfileId }
  });

  useEffect(() => {
    if (newNotificationData?.newNotification) {
      const notification: Notification = newNotificationData.newNotification;
      const notifyData = getPushNotificationData(notification);

      if (notifyData) {
        // Display browser push notification
        BrowserPush.notify({ title: notifyData.title || 'New Notification', body: notifyData.message });
        
        // This is where you could also handle backend subscription logic if needed
        subscribeUserToPush(notification).catch(console.error);
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