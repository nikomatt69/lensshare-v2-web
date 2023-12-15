import { APP_NAME, WALLETCONNECT_PROJECT_ID } from '@lensshare/data/constants';
import { CoinbaseWalletConnector } from '@wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from '@wagmi/connectors/injected';
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect';
import type { FC, ReactNode } from 'react';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import {
  base,
  baseGoerli,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  zora,
  zoraTestnet
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';

// 1. Import the DynamicWagmiConnector
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
const { chains, publicClient } = configureChains(
  [
    polygon,
    polygonMumbai,
    mainnet,
    goerli,
    zora,
    zoraTestnet,
    optimism,
    optimismGoerli,
    base,
    baseGoerli
  ],
  [publicProvider()]
);

const connectors: any = [
  new InjectedConnector({ chains, options: { shimDisconnect: true } }),
  new CoinbaseWalletConnector({ options: { appName: APP_NAME } }),
  new WalletConnectConnector({
    options: {
      projectId: WALLETCONNECT_PROJECT_ID
    },
    chains
  })
];

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient
});

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider: FC<Web3ProviderProps> = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <DynamicContextProvider
        settings={{
          environmentId: '4ae8558e-661a-44a9-85e5-f570bc06e76a',
          walletConnectors: [EthereumWalletConnectors]
        }}
      >
        <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
      </DynamicContextProvider>
    </WagmiConfig>
  );
};

export default Web3Provider;
