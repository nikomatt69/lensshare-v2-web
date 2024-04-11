import type { Profile } from '@lensshare/lens';
import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import Loader from '@components/Shared/Loader';
import ProfileStaffTool from '@components/Staff/Users/Overview/Tool';
import { UserIcon } from '@heroicons/react/24/outline';
import { APP_NAME } from '@lensshare/data/constants';
import { PAGEVIEW } from '@lensshare/data/tracking';
import { useProfileQuery } from '@lensshare/lens';
import {
  Card,
  EmptyState,
  ErrorMessage,
  GridItemEight,
  GridItemFour,
  GridLayout
} from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import StaffSidebar from '../../Sidebar';
import { useAppStore } from 'src/store/persisted/useAppStore';

const Overview: NextPage = () => {
  const {
    isReady,
    query: { id }
  } = useRouter();
  const { currentProfile } = useAppStore();
  

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, {
      page: 'staff-tools',
      subpage: 'user-overview'
    });
  }, []);

  const { data, error, loading } = useProfileQuery({
    skip: !id || !isReady,
    variables: { request: { forProfileId: id } }
  });
  const profile = data?.profile as Profile;

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Staff Tools • User Overview • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="border-dashed border-yellow-600 !bg-yellow-300/20 p-5">
          {loading ? (
            <Loader message="Loading profile" />
          ) : !profile ? (
            <EmptyState
              hideCard
              icon={<UserIcon className="h-8 w-8" />}
              message="No profile found"
            />
          ) : error ? (
            <ErrorMessage error={error} />
          ) : (
            <ProfileStaffTool profile={profile} />
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Overview;
