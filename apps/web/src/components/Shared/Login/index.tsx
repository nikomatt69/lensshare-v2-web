/* eslint-disable react/no-children-prop */
import WalletSelector from '@components/Shared/Login/WalletSelector';
import Signup from '@components/Shared/Login/New';
import { APP_NAME } from '@lensshare/data/constants';
import type { FC } from 'react';
import { useState } from 'react';
import {
  DynamicContextProvider,
  DynamicEmbeddedWidget,
  DynamicWidget
} from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

const Login: FC = () => {
  const [hasConnected, setHasConnected] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="p-5">
      {showSignup ? (
        <div>
          <div className="mb-5 space-y-1">
            <div className="text-xl font-bold">Create testnet profile.</div>
            <div className="ld-text-gray-500 text-sm">
              Create a new profile on the {APP_NAME} testnet.
            </div>
          </div>
          <Signup />
        </div>
      ) : (
        <div className="space-y-5">
          {hasConnected ? (
            <div className="space-y-1">
              <div className="text-xl font-bold">Please sign the message.</div>
              <div className="ld-text-gray-500 text-sm">
                {APP_NAME} uses this signature to verify that you're the owner
                of this address.
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-xl font-bold">Connect your wallet.</div>
              <div className="ld-text-gray-500 text-sm">
                Connect with one of our available wallet providers or create a
                new one.
              </div>
            </div>
          )}
          <WalletSelector
            setHasConnected={setHasConnected}
            setShowSignup={setShowSignup}
          />
        </div>
      )}
    </div>
  );
};

export default Login;
