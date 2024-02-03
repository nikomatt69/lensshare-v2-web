/* eslint-disable react-hooks/rules-of-hooks */
import { VideoCameraIcon } from '@heroicons/react/24/outline';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import Link from 'next/link';
import router from 'next/router';

import type { FC } from 'react';
import { useState } from 'react';

const MeetingIcon: FC = () => {
  const [show, setShow] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');

  return (
    <div>
      <div className="mx-1 mt-3 flex text-black dark:text-white">
        <img
          src={`${STATIC_ASSETS_URL}/push/callacceptbtn.svg`}
          onClick={async () => {
            const apiCall = await fetch('/api/create-room', {
              mode: 'no-cors',
              method: 'POST',
              body: JSON.stringify({
                title: 'LensShare-Space'
              }),
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'wWUkmfVYqMCcYLKEGA8VE1fZ4hWyo5d0' || ''
              }
            });
            const data = (await apiCall.json()) as {
              data: { roomId: string };
            };
            const { roomId } = data.data;
            const currentUrl = window.location.href;
            const url = currentUrl.match(/^https?:\/\/([^/]+)/)?.[0];
            const meetingUrl = `${url}/spaces/${roomId}`;

            // Instead of sending a message, set the meeting URL in the state
            setShow(true);
            setMeetingUrl(meetingUrl);
            router.push(`${url}/spaces/${roomId}`);
          }}
          className="mb-1 mr-1 inline h-7 w-7 cursor-pointer text-black dark:text-white"
        />
      </div>
      <div className="mx-1 mt-2 ">
        {show && (
          <Link href={meetingUrl}>
            <VideoCameraIcon className="aside h-6 w-6 text-green-500" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default MeetingIcon;
