import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';

import { Leafwatch } from '@lib/leafwatch';
import Custom404 from 'src/pages/404';

import { useEffectOnce } from 'usehooks-ts';

import StaffSidebar from '../Sidebar';
import List from './List';
import { useAppStore } from 'src/store/persisted/useAppStore';

import { PAGEVIEW } from '@lensshare/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@lensshare/ui';
import { ADMIN_ADDRESS, ADMIN_ADDRESS2, ADMIN_ADDRESS3, APP_NAME } from '@lensshare/data/constants';

const FeatureFlags: NextPage = () => {
  const { currentProfile } = useAppStore();


  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, {
      page: 'staff-tools',
      subpage: 'feature-flags'
    });
  });

  if (
    currentProfile?.ownedBy.address === ADMIN_ADDRESS ||
    ADMIN_ADDRESS2 ||
    ADMIN_ADDRESS3
  ) {

  return (
    <GridLayout>
      <MetaTags title={`Staff Tools • Feature Flags • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <List />
      </GridItemEight>
    </GridLayout>
  );
  }
};

export default FeatureFlags;
