import MetaTags from '@components/Common/MetaTags';
import { APP_NAME, GROUPS_WORKER_URL, LENSSHARE_API_URL } from '@lensshare/data/constants';
import { PAGEVIEW } from '@lensshare/data/tracking';
import type { Group } from '@lensshare/types/hey';
import { GridItemEight, GridItemFour, GridLayout } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useEffectOnce } from 'usehooks-ts';


import Feed from './Feed';
import GroupPageShimmer from './Shimmer';

const ViewGroup: NextPage = () => {
  const {
    isReady,
    query: { slug }
  } = useRouter();

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'group' });
  });

  const fetchGroup = async (): Promise<Group> => {
    const response: {
      data: { result: Group };
    } = await axios.get(`${LENSSHARE_API_URL}/group/get`, {
      params: { slug }
    });

    return response.data?.result;
  };

  const {
    data: group,
    error,
    isLoading
  } = useQuery({
    enabled: isReady,
    queryFn: fetchGroup,
    queryKey: ['fetchGroup', slug]
  });

  if (!isReady || isLoading) {
    return <GroupPageShimmer />;
  }

  if (!group) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  return (
    <>
      <MetaTags title={`Group • ${group.name} • ${APP_NAME}`} />
      <GridLayout className="pt-6">
       
        <GridItemEight className="space-y-5">
          <Feed group={group} />
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewGroup;
