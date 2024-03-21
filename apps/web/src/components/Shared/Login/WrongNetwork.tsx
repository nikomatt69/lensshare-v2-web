import type { FC } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useGlobalModalStateStore } from 'src/store/useGlobalModalStateStore';

import SwitchNetwork from '../SwitchNetwork';
import { CHAIN } from '@lib/costantChain';
import { POLYGON_CHAIN_ID } from '@lensshare/data/constants';

const WrongNetwork: FC = () => {
  const setShowWrongNetworkModal = useGlobalModalStateStore(
    (state) => state.setShowWrongNetworkModal
  );

  return (
    <div className="p-5">
      <div className="mb-4 space-y-1">
        <div className="text-xl font-bold">Change network.</div>
        <div className="lt-text-gray-500 text-sm">
          Connect to the correct network to continue
        </div>
      </div>
      <SwitchNetwork
        toChainId={POLYGON_CHAIN_ID}
        onSwitch={() => setShowWrongNetworkModal(false)}
      />
    </div>
  );
};

export default WrongNetwork;
