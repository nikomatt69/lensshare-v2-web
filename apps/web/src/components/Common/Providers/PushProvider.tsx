import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import { Buffer } from 'buffer';



function urlBase64ToUint8Array(base64String: string) {
  return new Uint8Array(Buffer.from(base64String, 'base64'));
}
function requestNotificationPermission() {
  Notification.requestPermission(function (status) {
    console.log('Notification permission status:', status);
  });
}

function subscribeUserToPush() {
  navigator.serviceWorker.ready.then(function (registration) {
    if (!registration.pushManager) {
      console.log('Push manager unavailable.');
      return;
    }

    registration.pushManager
      .getSubscription()
      .then(function (existedSubscription) {
        if (existedSubscription === null) {
          console.log('No subscription detected, make a request.');
          registration.pushManager
            .subscribe({
              applicationServerKey: urlBase64ToUint8Array(
                'XM4AEIEab3vFrg_zdVPCYDR7aHJYrCTRL4rpKGtqOwE'
              ),
              userVisibleOnly: true
            })
            .then(function (newSubscription) {
              console.log('New subscription added.');
              // send to server
            })
            .catch(function (error) {
              if (Notification.permission !== 'granted') {
                console.log('Permission was not granted.');
              } else {
                console.error(
                  'An error ocurred during the subscription process.',
                  error
                );
              }
            });
        } else {
          console.log('Existed subscription detected.');
        }
      });
  });
}

interface PushNotiProviderProps {
  children: ReactNode;
}

const PushNotiProvider: FC<PushNotiProviderProps> = ({ children }) => {
  useEffect(() => {
    requestNotificationPermission();
    subscribeUserToPush();
  }, []);

  return <div>{children}</div>;
};

export default PushNotiProvider;


