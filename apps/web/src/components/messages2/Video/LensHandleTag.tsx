import type { Profile } from '@lensshare/lens';
import React, { useCallback, useEffect, useState } from 'react';
import useFetchLensProfiles from './useFetchLensProfiles';

type LensHandleTagPropType = {
  profile: string;
};

const LensHandleTag = ({ profile }: LensHandleTagPropType) => {
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
      {showProfile.map((profile) => (
        <div key={profile.ownedBy.address}>
          <div>{profile?.handle?.localName ?? profile?.handle?.localName}</div>
        </div>
      ))}
    </div>
  );
};

export default LensHandleTag;
