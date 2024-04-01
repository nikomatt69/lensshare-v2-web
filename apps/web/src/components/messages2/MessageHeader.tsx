import Unfollow from '@components/Shared/Profile/Unfollow';
import UserProfile from '@components/Shared/UserProfile';
import { ChevronLeftIcon, PhoneIcon } from '@heroicons/react/24/outline';
import type { Profile } from '@lensshare/lens';
import formatAddress from '@lensshare/lib/formatAddress';
import getStampFyiURL from '@lensshare/lib/getStampFyiURL';
import { Image } from '@lensshare/ui';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useMessageStore } from 'src/store/message';

import Follow from '../Shared/Profile/Follow';
import Link from 'next/link';
import useSendOptimisticMessage from 'src/hooks/useSendOptimisticMessage';
import { ContentTypeText } from '@xmtp/xmtp-js';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import router from 'next/router';
import getLennyURL from '@lensshare/lib/getLennyURL';
import getAvatar from '@lensshare/lib/getAvatar';

interface MessageHeaderProps {
  profile?: Profile;
  conversationKey?: string;
}

const MessageHeader: FC<MessageHeaderProps> = ({
  profile,
  conversationKey
}) => {
  const [following, setFollowing] = useState(true);
  const unsyncProfile = useMessageStore((state) => state.unsyncProfile);
  const ensNames = useMessageStore((state) => state.ensNames);
  const setConversationKey = useMessageStore(
    (state) => state.setConversationKey
  );
  const { sendMessage } = useSendOptimisticMessage(conversationKey ?? '');
  const [show, setShow] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');
  const ensName = ensNames.get(conversationKey?.split('/')[0] ?? '');
  const url =
    (profile
      ? getAvatar(profile)
      : getStampFyiURL(conversationKey?.split('/')[0] ?? '')) ?? '';

  const setFollowingWrapped = useCallback(
    (following: boolean) => {
      setFollowing(following);
      unsyncProfile(profile?.id ?? '');
    },
    [setFollowing, unsyncProfile, profile?.id]
  );

  const onBackClick = () => {
    setConversationKey('');
  };

  useEffect(() => {
    setFollowing(profile?.operations.isFollowedByMe.value ?? false);
  }, [profile?.operations.isFollowedByMe.value]);

  if (!profile && !conversationKey) {
    return null;
  }

  return (
    <div className="divider flex items-center justify-between px-4 py-2">
      <div className="flex items-center">
        <ChevronLeftIcon
          onClick={onBackClick}
          className="mr-1 h-6 w-6 cursor-pointer lg:hidden"
        />
        {profile ? (
          <UserProfile profile={profile} />
        ) : (
          <div className="flex min-h-[48px] items-center space-x-3">
            <Image
              src={ensName ? url : getAvatar(profile)}
              loading="lazy"
              className="h-10 min-h-[40px] w-10 min-w-[40px] rounded-full border bg-gray-200 dark:border-gray-700"
              height={40}
              width={40}
              alt={ensName ?? formatAddress(conversationKey ?? '')}
            />
            <div>{ensName ?? formatAddress(conversationKey ?? '')}</div>
          </div>
        )}
      </div>

      <img
        src={`${STATIC_ASSETS_URL}/images/camera-video.svg`}
        onClick={async () => {
          const apiCall = await fetch('/api/create-room', {
            mode: 'no-cors',
            method: 'POST',
            body: JSON.stringify({
              title: 'MyCrumbs-Space'
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
          const meetingUrl = `${url}/meet/${roomId}`;
          sendMessage(
            `VideoCall Incoming at ${url}/meet/${roomId}`,
            ContentTypeText
          );

          // Instead of sending a message, set the meeting URL in the state

          // Instead of sending a message, set the meeting URL in the state
          setShow(true);
          setMeetingUrl(meetingUrl);
          router.push(`${url}/meet/${roomId}`);
        }}
        className="text-brand-700 mb-2 mr-2 inline h-8 w-8 cursor-pointer"
      />
      <div className="mx-2 mt-2 ">
        {show && (
          <Link href={meetingUrl}>
            <PhoneIcon className="h-6 w-6 text-green-500" />
          </Link>
        )}
      </div>
      {profile ? (
        <div>
          {!following ? (
            <Follow profile={profile} setFollowing={setFollowingWrapped} />
          ) : (
            <Unfollow profile={profile} setFollowing={setFollowingWrapped} />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default MessageHeader;
