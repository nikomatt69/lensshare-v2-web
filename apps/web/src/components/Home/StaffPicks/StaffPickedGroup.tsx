import GroupProfile from '@components/Shared/GroupProfile';
import GroupProfileShimmer from '@components/Shared/Shimmer/GroupProfileShimmer';
import { GROUPS_WORKER_URL, LENSSHARE_API_URL } from '@lensshare/data/constants';
import type { Group } from '@lensshare/types/hey';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';

interface StaffPickedGroupProps {
  id: string;
}

const StaffPickedGroup: FC<StaffPickedGroupProps> = ({ id }) => {
  const fetchGroup = async (): Promise<Group> => {
    const response: {
      data: { result: Group };
    } = await axios.get(`${LENSSHARE_API_URL}/group/get`);

    return response.data?.result;
  };

  const { data: group, isLoading } = useQuery({
    queryKey: ['fetchGroup', id],
    queryFn: fetchGroup
  });

  if (isLoading) {
    return <GroupProfileShimmer />;
  }

  if (!group) {
    return null;
  }

  return <GroupProfile group={group} />;
};

export default StaffPickedGroup;
