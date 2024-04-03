import MetaTags from '@components/Common/MetaTags';
import SuperFollow from '@components/Settings/Account/SuperFollow';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@lensshare/data/constants';
import { GridItemEight, GridItemFour, GridLayout } from '@lensshare/ui';
import type { NextPage } from 'next';
import { useAppStore } from 'src/store/persisted/useAppStore';

import SettingsSidebar from '../Sidebar';


const WalletSettings: NextPage = () => {
  const { currentProfile } = useAppStore();

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Wallet settings • ${APP_NAME}`} />
      <GridItemFour>
      <SettingsSidebar />
      </GridItemFour>
    </GridLayout>
  );
};

export default WalletSettings;
