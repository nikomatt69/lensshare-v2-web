import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import type { Profile } from '@lensshare/lens';
import getAvatar from '@lensshare/lib/getAvatar';
import getProfile from '@lensshare/lib/getProfile';
import hasMisused from '@lensshare/lib/hasMisused';
import { Image } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { getTwitterFormat } from '@lib/formatTime';
import Link from 'next/link';
import type { FC } from 'react';
import { memo } from 'react';

import Slug from './Slug';
import IsVerified from './IsVerified';

interface UserProfileProps {
  profile: Profile;
  timestamp?: Date;
  smallAvatar?: boolean;
  linkToProfile?: boolean;
}

const SmallUserProfile: FC<UserProfileProps> = ({
  profile,
  timestamp = '',
  smallAvatar = false,
  linkToProfile = false
}) => {
  const UserAvatar = () => (
    <Image
      src={getAvatar(profile)}
      loading="lazy"
      className={cn(
        smallAvatar ? 'h-5 w-5' : 'h-6 w-6',
        'rounded-full border bg-gray-200 dark:border-gray-700'
      )}
      height={smallAvatar ? 20 : 24}
      width={smallAvatar ? 20 : 24}
      alt={profile.id}
    />
  );

  const UserName = () => (
    <div className="flex max-w-full flex-wrap items-center">
      <div className="mr-1 max-w-[75%] truncate">
        {getProfile(profile).displayName}
      </div>
      <IsVerified id={profile?.id} size="xs" />
      {hasMisused(profile.id) ? (
        <ExclamationCircleIcon className="mr-2 h-4 w-4 text-red-500" />
      ) : null}
      <Slug className="text-sm" slug={getProfile(profile).slugWithPrefix} />
      {timestamp ? (
        <span className="lt-text-gray-500">
          <span className="mx-1.5">·</span>
          <span className="text-xs">{getTwitterFormat(timestamp)}</span>
        </span>
      ) : null}
    </div>
  );

  return linkToProfile ? (
    <Link href={getProfile(profile).link}>
      <div className="flex items-center space-x-2">
        <UserAvatar />
        <UserName />
      </div>
    </Link>
  ) : (
    <div className="flex items-center space-x-2">
      <UserAvatar />
      <UserName />
    </div>
  );
};

export default memo(SmallUserProfile);
