import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@lensshare/data/constants';
import { PAGEVIEW } from '@lensshare/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useAppStore } from 'src/store/persisted/useAppStore';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import ProfileSettingsForm from './Profile';

const ProfileSettings: NextPage = () => {
  const { currentProfile } = useAppStore();


  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Profile settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <ProfileSettingsForm profile={currentProfile as any} />
      </GridItemEight>
    </GridLayout>
  );
};

export default ProfileSettings;
