import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@lensshare/data/constants';
import { PAGEVIEW } from '@lensshare/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useAppStore } from 'src/store/useAppStore';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import HighSignalNotificationFilter from './HighSignalNotificationFilter';
import IsPride from './IsPride';
import PushNotifications from './PushNotifications';

const PreferencesSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);



  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Cleanup settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="p-5">
          <div className="space-y-3">
            <div className="text-lg font-bold">Your Preferences</div>
            <p>
              Update your preferences to control how you can change your
              experience on {APP_NAME}.
            </p>
          </div>
          <div className="divider my-5" />
          <div className="space-y-6">
            <HighSignalNotificationFilter />
            <PushNotifications />
            <IsPride />
          </div>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default PreferencesSettings;
