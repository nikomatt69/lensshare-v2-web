import type { Profile } from '@lensshare/lens';
import type { FC } from 'react';

import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import getTbaStatus from '@lib/api/getTbaStatus';
import { Tooltip } from '@lensshare/ui';

import { useQuery } from '@tanstack/react-query';

interface TbaBadgeProps {
  profile: Profile;
}

const TbaBadge: FC<TbaBadgeProps> = ({ profile }) => {
  const { data: isTba } = useQuery({
    queryFn: () => getTbaStatus(profile.ownedBy.address),
    queryKey: ['getTbaStatus', profile.ownedBy.address]
  });

  if (!isTba) {
    return null;
  }



  return (
    <Tooltip content="Token Bounded Account">
      <img
        alt="Token Bounded Account"
        className="h-6 w-6"
        height={24}
        src={`${STATIC_ASSETS_URL}/icon.png`}
        width={24}
      />
    </Tooltip>
  );
};

export default TbaBadge;
