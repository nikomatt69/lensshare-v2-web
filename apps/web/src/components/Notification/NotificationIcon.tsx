import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { FC } from 'react';
import { useNotificationPersistStore } from 'src/store/useNotificationPersistStore';

const NotificationIcon: FC = () => {
  const latestNotificationId = useNotificationPersistStore(
    (state) => state.latestNotificationId
  );
  const lastOpenedNotificationId = useNotificationPersistStore(
    (state) => state.lastOpenedNotificationId
  );
  const setLastOpenedNotificationId = useNotificationPersistStore(
    (state) => state.setLastOpenedNotificationId
  );


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
    </Link>
  );
};

export default NotificationIcon;
