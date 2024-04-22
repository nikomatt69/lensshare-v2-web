import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import type { Profile } from '@lensshare/lens';
import { useProfileQuery } from '@lensshare/lens';
import type { FC } from 'react';

interface StaffPickedProfileProps {
  id: string;
}

const StaffPickedProfile: FC<StaffPickedProfileProps> = ({ id }) => {
  const { data, loading } = useProfileQuery({
    variables: { request: { forProfileId: id } },
    skip: !Boolean(id)
  });

  if (loading) {
    return <UserProfileShimmer />;
  }

  if (!data?.profile) {
    return null;
  }

  return <UserProfile profile={data.profile as Profile} />;
};

export default StaffPickedProfile;
