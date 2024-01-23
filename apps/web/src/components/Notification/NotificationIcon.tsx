import { BellIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Link from 'next/link';
import type { FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useNotificationPersistStore } from 'src/store/useNotificationPersistStore';
import type { Notification } from '@lensshare/lens';
const NotificationIcon: FC = () => {
  const latestNotificationId = useNotificationPersistStore(
    (state) => state.latestNotificationId
  );
  const lastOpenedNotificationId = useNotificationPersistStore(
    (state) => state.lastOpenedNotificationId
  );
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setLastOpenedNotificationId = useNotificationPersistStore(
    (state) => state.setLastOpenedNotificationId
  );
  const pushNotification = (latestNotificationId: any) => {
    if (latestNotificationId) {
      const fetchNotifications = async (userAddress: Notification) => {
        try {
          const response = await axios.post('/api/getnotification', {
            userAddress
          });
          return response.data;
        } catch (error) {
          console.error('Error fetching notifications:', error);
          throw error;
        }
      };

      // Usage example
      const userAddress = currentProfile?.id.ownedBy.address;
      fetchNotifications(userAddress)
        .then((notifications) => {
          console.log('Received notifications:', notifications);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      const notification = fetchNotifications(latestNotificationId); // Assuming getNoti is a function to retrieve notification details
      // Push notification logic using retrieved notification
      console.log('Notification pushed:', notification);
    }
  };



  

  return (
    <Link
      href="/notifications"
      className=" rounded-md  hover:bg-gray-300/20 "
      onClick={() => {
        if (latestNotificationId) {
          setLastOpenedNotificationId(latestNotificationId);
          pushNotification(latestNotificationId);

         
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
