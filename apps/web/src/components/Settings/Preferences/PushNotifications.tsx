import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { BellIcon } from '@heroicons/react/24/outline';
import { SETTINGS } from '@lensshare/data/tracking';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import { Leafwatch } from '@lib/leafwatch';
import { type FC, useState, useEffect } from 'react';
import { useEffectOnce } from 'usehooks-ts';

const PushNotifications: FC = () => {
  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState(false);
  useEffectOnce(() => {
    if (Notification.permission === 'granted') {
      setPushNotificationsEnabled(true);
    }
  });
  const togglePushNotifications = async () => {
    if (Notification.permission !== 'granted') {
      const status = await Notification.requestPermission();
      if (status === 'granted') {
        setPushNotificationsEnabled(true);
      }

      Leafwatch.track(SETTINGS.PREFERENCES.TOGGLE_PUSH_NOTIFICATIONS, {
        enabled: status === 'granted'
      });
    }
  };

  function urlBase64ToUint8Array(base64String: any) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  const convertedVapidKey = urlBase64ToUint8Array(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
  );
  const currentSessionProfileId = getCurrentSessionProfileId();
  const profileId = currentSessionProfileId;

  const useSubscribeToNotifications = async (profileId: string) => {
    useEffect(() => {
      if ('serviceWorker' in navigator && profileId) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidKey
            })
            .then((subscription) => {
              fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ subscription, profileId })
              });
            })
            .catch((error) => console.error('Error subscribing:', error));
        });
      }
    }, [profileId]);
  };
  useSubscribeToNotifications(profileId);
  return (
    <ToggleWithHelper
      on={pushNotificationsEnabled}
      setOn={togglePushNotifications}
      heading="Push Notifications"
      description="Turn on push notifications to receive notifications."
      icon={<BellIcon className="h-4 w-4" />}
    />
  );
};
export default PushNotifications;
