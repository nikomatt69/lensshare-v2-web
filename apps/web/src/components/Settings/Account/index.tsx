import MetaTags from '@components/Common/MetaTags';
import SuperFollow from '@components/Settings/Account/SuperFollow';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@lensshare/data/constants';
import { GridItemEight, GridItemFour, GridLayout } from '@lensshare/ui';
import type { NextPage } from 'next';
import { useAppStore } from 'src/store/useAppStore';

import SettingsSidebar from '../Sidebar';
import Verification from './Verification';


const AccountSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Account settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <SuperFollow />
        <Verification />
      </GridItemEight>
    </GridLayout>
  );
};

export default AccountSettings;
