import MetaTags from '@components/Common/MetaTags';
import { APP_NAME, GROUPS_WORKER_URL } from '@lensshare/data/constants';
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

import Details from './Details';
import Feed from './Feed';
import GroupPageShimmer from './Shimmer';

const ViewGroup: NextPage = () => {
  const {
    query: { slug },
    isReady
  } = useRouter();


  const fetchGroup = async (): Promise<Group> => {
    const response: {
      data: { result: Group };
    } = await axios.get(`${GROUPS_WORKER_URL}/get/${slug}`);

    return response.data?.result;
  };

  const {
    data: group,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fetchGroup', slug],
    queryFn: fetchGroup,
    enabled: isReady
  });

  if (isLoading) {
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
        <GridItemFour>
          <Details group={group} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <Feed group={group} />
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewGroup;
