import MetaTags from '@components/Common/MetaTags';
import SuperFollow from '@components/Settings/Account/SuperFollow';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@lensshare/data/constants';
import { GridItemEight, GridItemFour, GridLayout } from '@lensshare/ui';
import type { NextPage } from 'next';
import { useAppStore } from 'src/store/useAppStore';

import SettingsSidebar from '../Sidebar';

import XMTPConnectButton from '@components/Shared/XmtpButton';
import { DynamicContextProvider, DynamicEmbeddedWidget } from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

const WalletSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Wallet settings • ${APP_NAME}`} />
      <GridItemFour>
      <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        
        <DynamicContextProvider
            settings={{
              environmentId: '4ae8558e-661a-44a9-85e5-f570bc06e76a',
              walletConnectors: [EthereumWalletConnectors]
            }}
          >
            <DynamicWagmiConnector>
            <DynamicEmbeddedWidget background="default" />
            </DynamicWagmiConnector>
          </DynamicContextProvider>
      </GridItemEight>
    </GridLayout>
  );
};

export default WalletSettings;
