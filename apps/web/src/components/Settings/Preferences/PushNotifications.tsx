import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { BellIcon } from '@heroicons/react/24/outline';
import { SETTINGS } from '@lensshare/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import { type FC, useState, useEffect } from 'react';

const PushNotifications: FC = () => {
  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState(false);

  useEffect(() => {
    if (Notification.permission === 'granted') {
      setPushNotificationsEnabled(true);
    }
  }, []);

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

  return (
    <ToggleWithHelper
      description="Turn on push notifications to receive notifications."
      heading="Push Notifications"
      icon={<BellIcon className="h-5 w-5" />}
      on={pushNotificationsEnabled}
      setOn={togglePushNotifications}
    />
  );
};

export default PushNotifications;
