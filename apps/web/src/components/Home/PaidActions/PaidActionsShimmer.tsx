import type { FC } from 'react';

import { Card } from '@lensshare/ui';
import SmallUserProfileShimmer from '@components/Shared/Shimmer/SmallUserProfileShimmer';
import PublicationShimmer from '@components/Shared/Shimmer/PublicationShimmer';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';

const PaidActionsShimmer: FC = () => {
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center space-x-2 px-5 py-3">
          <div className="shimmer h-3 w-3/12 rounded-full" />
          <SmallUserProfileShimmer smallAvatar />
        </div>
        <div className="divider" />
        <PublicationShimmer />
      </Card>
      <Card>
        <div className="flex items-center space-x-2 p-5">
          <div className="shimmer h-3 w-3/12 rounded-full" />
          <SmallUserProfileShimmer smallAvatar />
        </div>
        <div className="divider" />
        <div className="p-5">
          <UserProfileShimmer isBig />
        </div>
      </Card>
      <Card>
        <div className="flex items-center space-x-2 p-5">
          <div className="shimmer h-3 w-3/12 rounded-full" />
          <SmallUserProfileShimmer smallAvatar />
        </div>
        <PublicationShimmer />
      </Card>
    </div>
  );
};

export default PaidActionsShimmer;
