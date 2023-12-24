import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';

import { Leafwatch } from '@lib/leafwatch';

import { useEffectOnce } from 'usehooks-ts';

import StaffSidebar from '../Sidebar';
import LeafwatchStats from './LeafwatchStats';
import Links from './Links';
import { useAppStore } from 'src/store/useAppStore';
import { useFeatureFlagsStore } from 'src/store/useFeatureFlagsStore';
import { PAGEVIEW } from '@lensshare/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@lensshare/ui';
import {
  ADMIN_ADDRESS,
  ADMIN_ADDRESS2,
  ADMIN_ADDRESS3,
  APP_NAME
} from '@lensshare/data/constants';

const Overview: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const staffMode = useFeatureFlagsStore((state) => state.staffMode);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'staff-tools', subpage: 'overview' });
  });

  if (
    currentProfile?.ownedBy.address === ADMIN_ADDRESS ||
    ADMIN_ADDRESS2 ||
    ADMIN_ADDRESS3
  ) {
    return (
      <GridLayout>
        <MetaTags title={`Staff Tools • Overview • ${APP_NAME}`} />
        <GridItemFour>
          <StaffSidebar />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <Card>
            <LeafwatchStats />
          </Card>
          <Card className="p-5">
            <Links />
          </Card>
        </GridItemEight>
      </GridLayout>
    );
  }
};

export default Overview;
