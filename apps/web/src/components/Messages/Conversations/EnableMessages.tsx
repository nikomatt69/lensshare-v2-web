import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';

import { Button, EmptyState } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import { loadKeys, storeKeys } from '@lib/xmtp/keys';
import { Client, useClient } from '@xmtp/react-sdk';
import { providers } from 'ethers';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';
import { configureChains, useAccount, useWalletClient } from 'wagmi';

const EnableMessages: FC = () => {
  const [initializeing, setInitializing] = useState(false);
  const { initialize } = useClient();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const initXmtp = async () => {
    if (!address) {
      return;
    }

    try {
      setInitializing(true);

      let keys = loadKeys(address);
      if (!keys) {
        keys = await Client.getKeys(walletClient as any, { env: 'production' });
        storeKeys(address, keys);
      }
      await initialize({
        keys,
        options: { env: 'production' },
        signer: walletClient as any
      });
      

      return toast.success('Messages enabled successfully');
    } finally {
      setInitializing(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <EmptyState
        hideCard
        icon={<CursorArrowRaysIcon className="h-10 w-10" />}
        message="Enable Messages"
      />
      <Button disabled={initializeing} onClick={initXmtp}>
        Enable
      </Button>
    </div>
  );
};

export default EnableMessages;