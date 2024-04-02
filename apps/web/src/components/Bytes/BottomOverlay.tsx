/* eslint-disable @typescript-eslint/no-unused-vars */
import Follow from '@components/Shared/Profile/Follow';
import Unfollow from '@components/Shared/Profile/Unfollow';
import type { MirrorablePublication, Profile } from '@lensshare/lens';
import type { FC } from 'react';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from 'src/store/persisted/useAppStore';
import getProfile from '@lensshare/lib/getProfile';
import { formatNumber } from 'src/hooks/formatNumber';
import { getPublicationData } from 'src/hooks/getPublicationData';
import getAvatar from '@lensshare/lib/getAvatar';

type Props = {
  video: MirrorablePublication;
};

const BottomOverlay: FC<Props> = ({ video }) => {
  const profile = video.by;
  const { currentProfile } = useAppStore();
  const [following, setFollowing] = useState(false);
  return (
    <div className="from-trasparent absolute bottom-0 left-0 right-0 z-[1] mb-4 rounded-b-xl bg-gradient-to-t to-transparent px-3 pb-3 pt-5 text-gray-400">
      <Link href={`/posts/${video?.id}`} key={video.id}>
        <h1 className="backdrop-brightness-25 backdrop-contrast-20 line-clamp-2 break-all pb-2 font-bold text-gray-200 backdrop-blur-sm">
          {getPublicationData(video.metadata)?.title}
        </h1>
      </Link>
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <Link
            href={`/u/${getProfile(video.by)?.slug}`}
            className="backdrop-brightness-25 backdrop-contrast-20 flex flex-none cursor-pointer items-center space-x-2 px-2 backdrop-blur-sm"
          >
            <img
              src={getAvatar(profile)}
              className="h-9 w-9 rounded-full"
              draggable={false}
              alt={getProfile(video.by)?.slug}
            />
            <div className="flex min-w-0 flex-col items-start text-gray-200">
              <h6 className="flex max-w-full items-center space-x-1">
                <span className="truncate">{getProfile(video.by)?.slug}</span>
              </h6>
              <span className="inline-flex items-center space-x-1 text-xs text-gray-200">
                {formatNumber(profile.stats?.followers)} followers
              </span>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          {currentProfile ? (
            <div>
              {!following ? (
                <Follow
                  profile={profile as Profile}
                  setFollowing={setFollowing}
                />
              ) : (
                <Unfollow
                  profile={profile as Profile}
                  setFollowing={setFollowing}
                />
              )}
            </div>
          ):null}
        </div>
      </div>
    </div>
  );
};

export default BottomOverlay;
