import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@lensshare/data/constants';
import { GridItemEight, GridItemFour, GridLayout } from '@lensshare/ui';
import type { NextPage } from 'next';
import { useAppStore } from 'src/store/useAppStore';
import { useAccount } from 'wagmi';

import SettingsSidebar from '../Sidebar';
import LensManager from './LensManager';
import ProfileManager from './ProfileManager';
import WrongWallet from '@components/Shared/WrongWallet';

const ManagerSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { address } = useAccount();
  const disabled = currentProfile?.ownedBy.address !== address;

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Manager • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        {disabled ? (
          <WrongWallet />
        ) : (
          <>
            <LensManager />
            <ProfileManager />
          </>
        )}
      </GridItemEight>
    </GridLayout>
  );
};

export default ManagerSettings;
