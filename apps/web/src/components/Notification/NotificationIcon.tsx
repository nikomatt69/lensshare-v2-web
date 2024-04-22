import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { FC } from 'react';
import { useAppStore } from 'src/store/persisted/useAppStore';

import React, { useEffect, useState } from 'react';
import { useNotificationStore } from 'src/store/persisted/useNotificationStore';

const NotificationIcon: FC = () => {
  const {
    latestNotificationId,
    lastOpenedNotificationId,
    setLastOpenedNotificationId
  } = useNotificationStore();

  const { currentProfile } = useAppStore();

  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  useEffect(() => {
    if (latestNotificationId) {
      setHasNewNotifications(true);
    }
  }, [latestNotificationId]);
  return (
    <Link
      href="/notifications"
      className=" rounded-md  hover:bg-gray-300/20 "
      onClick={() => {
        if (latestNotificationId) {
          setLastOpenedNotificationId(latestNotificationId);
        }
      }}
    >
      <BellIcon className="h-6 w-6 sm:h-6 sm:w-6" />
      {lastOpenedNotificationId !== latestNotificationId ? (
        <span className="h-2 w-2 rounded-full bg-red-500" />
      ) : null}
      {hasNewNotifications && (
        <span className="h-2 w-2 rounded-full bg-red-500" />
      )}
    </Link>
  );
};

export default NotificationIcon;
