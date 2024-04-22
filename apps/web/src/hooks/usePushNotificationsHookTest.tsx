import { useEffect } from 'react';

export const useNotificationSubscription = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
          });
        })
        .then((subscription) => {
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subscribe`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
          });
        })
        .catch((error) =>
          console.error('Error subscribing to notifications:', error)
        );
    }
  }, []);
};
