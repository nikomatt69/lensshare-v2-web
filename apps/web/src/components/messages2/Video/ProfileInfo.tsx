import Slug from '@components/Shared/Slug';

import React, { useCallback, useEffect, useState } from 'react';
import { Image } from '@lensshare/ui';
import type { Profile } from '@lensshare/lens';
import useFetchLensProfiles from './useFetchLensProfiles';
import getAvatar from '@lensshare/lib/getAvatar';

type ProfileInfoType = {
  status?: string;
  removeSlug?: boolean;
  profile: string;
};

const ProfileInfo = ({ status, removeSlug, profile }: ProfileInfoType) => {
  const [showProfile, setShowProfile] = useState<Profile[]>([]);
  const { getLensProfile } = useFetchLensProfiles();

  const getUserlensProfile = useCallback(async () => {
    const lensProfile = await getLensProfile(profile);
    setShowProfile(lensProfile ? [lensProfile] : []);
  }, [getLensProfile, profile]);

  useEffect(() => {
    getUserlensProfile();
  }, []);

  return (
    <div>
      <div>
        {showProfile.map((profile) => (
          <div key={profile.id}>
            <div className="flex flex-row items-center">
              <Image
                src={getAvatar(profile)}
                className={
                  status && removeSlug === undefined
                    ? 'mr-3 h-16 w-16 rounded-full'
                    : 'mr-3 h-12 rounded-full'
                }
              />
              <div className="flex flex-col">
                <span className="text-[12px] font-[500px] text-[#333333] dark:text-white md:text-[15px]">
                  {profile?.handle?.localName ?? profile?.handle?.localName}
                </span>
                <Slug
                  className={removeSlug !== undefined ? 'hidden' : 'text-[14px]'}

                  prefix="@" slug={''}                />
                <span className="whitespace-nowrap text-[12px] font-[300px] text-[#82828A] dark:text-[#D4D4D8] md:text-[14px]">
                  {status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileInfo;
