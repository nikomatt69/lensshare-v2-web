import { useNewNotificationSubscriptionSubscription } from '@lensshare/lens';
import getCurrentSession from '@lib/getCurrentSession';
import { subscribeUserToPush } from '@lib/notification';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

const useNotifictionSubscriptions = () => {
  const { address } = useAccount();
  const { id: sessionProfileId } = getCurrentSession();
  const canUseSubscriptions = Boolean(sessionProfileId) && address;

  useEffect(() => {
    if (canUseSubscriptions) {
      return;
    }
    subscribeUserToPush(async (sessionProfileId) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useNewNotificationSubscriptionSubscription({
        skip: !canUseSubscriptions,
        variables: { for: sessionProfileId }
      });
    });
  }, [canUseSubscriptions]);
};

export default useNotifictionSubscriptions;
