import Unfollow from '@components/Shared/Profile/Unfollow';
import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import { FollowModuleType, type Profile } from '@lensshare/lens';
import getAvatar from '@lensshare/lib/getAvatar';
import getMentions from '@lensshare/lib/getMentions';
import getProfile from '@lensshare/lib/getProfile';
import hasMisused from '@lensshare/lib/hasMisused';
import { Image } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { getTwitterFormat } from '@lib/formatTime';
import isVerified from '@lib/isVerified';
import Link from 'next/link';
import type { FC } from 'react';
import { memo, useState } from 'react';

import Markup from './Markup';
import Follow from './Profile/Follow';
import Slug from './Slug';
import SuperFollow from './SuperFollow';
import UserPreview from './UserPreview';
import IsVerified from './IsVerified';

interface UserProfileProps {
  profile: Profile;
  isFollowing?: boolean;
  isBig?: boolean;
  linkToProfile?: boolean;
  showBio?: boolean;
  showFollow?: boolean;
  showUnfollow?: boolean;
  showStatus?: boolean;
  showUserPreview?: boolean;
  timestamp?: Date;

  // For data analytics
  followUnfollowPosition?: number;
  followUnfollowSource?: string;
}

const UserProfile: FC<UserProfileProps> = ({
  profile,
  isFollowing = false,
  isBig = false,
  linkToProfile = true,
  showBio = false,
  showFollow = false,
  showUnfollow = false,
  showUserPreview = true,
  timestamp = '',
  followUnfollowPosition,
  followUnfollowSource
}) => {
  const [following, setFollowing] = useState(isFollowing);

  const UserAvatar = () => (
    <Image
      src={getAvatar(profile)}
      loading="lazy"
      className={cn(
        isBig ? 'h-14 w-14' : 'h-10 w-10',
        'rounded-full border bg-gray-200 dark:border-gray-700'
      )}
      height={isBig ? 56 : 40}
      width={isBig ? 56 : 40}
      alt={profile.id}
    />
  );

  const UserName = () => (
    <>
      <div className="flex max-w-sm items-center">
        <div className={cn(isBig ? 'font-bold' : 'text-md', 'grid')}>
          <div className="truncate">{getProfile(profile).displayName}</div>
        </div>
        <IsVerified id={profile?.id} size="xs" />
        {hasMisused(profile.id) ? (
          <ExclamationCircleIcon className="ml-1 h-4 w-4 text-red-500" />
        ) : null}
      </div>
      <div>
        <Slug className="text-sm" slug={getProfile(profile).slugWithPrefix} />
        {timestamp ? (
          <span className="lt-text-gray-500">
            <span className="mx-1.5">·</span>
            <span className="text-xs">{getTwitterFormat(timestamp)}</span>
          </span>
        ) : null}
      </div>
    </>
  );

  const UserInfo: FC = () => {
    return (
      <UserPreview
        handle={profile.handle?.fullHandle}
        id={profile.id}
        showUserPreview={showUserPreview}
      >
        <div className="mr-8 flex items-center space-x-3">
          <UserAvatar />
          <div>
            <UserName />
            {showBio && profile?.metadata?.bio ? (
              <div
                // Replace with Tailwind
                style={{ wordBreak: 'break-word' }}
                className={cn(
                  isBig ? 'text-base' : 'text-sm',
                  'mt-2',
                  'linkify leading-6'
                )}
              >
                <Markup mentions={getMentions(profile.metadata.bio)}>
                  {profile?.metadata.bio}
                </Markup>
              </div>
            ) : null}
          </div>
        </div>
      </UserPreview>
    );
  };

  return (
    <div className="flex items-center justify-between">
      {linkToProfile && profile.id ? (
        <Link href={getProfile(profile).link}>
          <UserInfo />
        </Link>
      ) : (
        <UserInfo />
      )}
      {showFollow ? (
        following ? null : profile?.followModule?.type ===
          FollowModuleType.FeeFollowModule ? (
          <SuperFollow
            profile={profile}
            setFollowing={setFollowing}
            superFollowPosition={followUnfollowPosition}
            superFollowSource={followUnfollowSource}
          />
        ) : (
          <Follow
            profile={profile}
            setFollowing={setFollowing}
            followPosition={followUnfollowPosition}
            followSource={followUnfollowSource}
          />
        )
      ) : null}
      {showUnfollow ? (
        following ? (
          <Unfollow
            profile={profile}
            setFollowing={setFollowing}
            unfollowPosition={followUnfollowPosition}
            unfollowSource={followUnfollowSource}
          />
        ) : null
      ) : null}
    </div>
  );
};

export default memo(UserProfile);
