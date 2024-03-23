import MetaTags from '@components/Common/MetaTags';
import Signup from '@components/Shared/Auth/Signup';

import NotLoggedIn from '@components/Shared/NotLoggedIn';
import SettingsHelper from '@components/Shared/SettingsHelper';
import { APP_NAME } from '@lensshare/data/constants';
import { PAGEVIEW } from '@lensshare/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useAppStore } from 'src/store/useAppStore';
import { useEffectOnce } from 'usehooks-ts';

const NewProfile: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);



  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Create Profile • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsHelper
          heading="Create profile"
          description="Create new decentralized profile"
        />
      </GridItemFour>
      <GridItemEight>
        <Card className="p-5">
          <Signup />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default NewProfile;
