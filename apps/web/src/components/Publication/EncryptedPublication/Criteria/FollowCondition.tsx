import LazySmallUserProfile from '@components/Shared/LazySmallUserProfile';
import type { FollowCondition as FollowConditionType } from '@lensshare/lens';
import type { FC } from 'react';



interface FollowConditionProps {
  condition: FollowConditionType;
}

const FollowCondition: FC<FollowConditionProps> = ({ condition }) => {
  return (
    <div className="flex items-center space-x-2">
      <div>Must follow the profile:</div>
      <LazySmallUserProfile id={condition.follow} linkToProfile />
    </div>
  );
};

export default FollowCondition;
