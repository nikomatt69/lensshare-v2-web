import type { Profile } from '@lensshare/lens';
import type { FC } from 'react';
import type { Address } from 'viem';

import SmallUserProfile from '@components/Shared/SmallUserProfile';
import { useProfileQuery } from '@lensshare/lens';

interface MintedByProps {
  address: Address;
}

const MintedBy: FC<MintedByProps> = ({ address }) => {
  const { data, loading } = useProfileQuery({
    skip: !address,
    variables: { request: { forProfileId: address } }
  });

  if (loading) {
    return null;
  }

  if (!data?.profile) {
    return null;
  }

  return (
    <div className="absolute left-3 top-3 rounded-lg bg-gray-950/70 px-2 py-1 text-sm text-white">
      <SmallUserProfile profile={data.profile as Profile} smallAvatar />
    </div>
  );
};

export default MintedBy;
