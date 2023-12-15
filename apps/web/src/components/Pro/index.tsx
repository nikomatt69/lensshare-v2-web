import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@lensshare/data/constants';

import { PAGEVIEW } from '@lensshare/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@lensshare/ui';

import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useAppStore } from 'src/store/useAppStore';
import { useEffectOnce } from 'usehooks-ts';

const Pro: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'pro' });
  });


  return (
    <GridLayout>
      <MetaTags title={`Pro • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <Card className="p-5">gm</Card>
      </GridItemEight>
      <GridItemFour>
        <Card className="p-5">gm</Card>
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Pro;
