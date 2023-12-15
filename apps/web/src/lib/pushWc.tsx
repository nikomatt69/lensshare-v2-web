import { WALLETCONNECT_PROJECT_ID } from '@lensshare/data/constants';
import type { FC } from 'react';
import React from 'react';
import { useAccount } from 'wagmi';

type RequestBody = {
  notification_id?: string | null;
  notification: {
    type: string;
    title: string;
    body: string;
    url?: string | null;
  };
  accounts: string[];
};

const PushWc: FC<RequestBody> = ({}) => {
  const { address } = useAccount();

  const PROJECT_ID = `${WALLETCONNECT_PROJECT_ID}`;
  const NOTIFY_API_SECRET = '7a367952-f0b6-4f50-8b86-ff29f11920bc';

  const sendNotification = async () => {
    const response = await fetch(
      `https://notify.walletconnect.com/${PROJECT_ID}/notify`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${NOTIFY_API_SECRET}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notification: {
            type: '97ec975f-2c15-483e-9da0-99dca1d6249d',
            title: 'LensShare',
            body: 'New Notification',
            url: 'https://lensshareapp.xyz/notifications'
          },
          accounts: [`eip155:1:${address}`]
        })
      }
    );

    // Handle the response here
    if (response.ok) {
      console.log('Notification sent successfully');
    } else {
      console.error('Failed to send notification');
    }
  };

  // Call the function when the component is mounted
  React.useEffect(() => {
    sendNotification();
  }, []);

  return null; // or return some JSX here
};

export default PushWc;