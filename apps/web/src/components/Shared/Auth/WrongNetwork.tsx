import type { FC } from 'react';

import { CHAIN_ID } from 'src/constants';


import SwitchNetwork from '../SwitchNetwork';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

const WrongNetwork: FC = () => {
  const { setShowWrongNetworkModal } = useGlobalModalStateStore();

  return (
    <div className="p-5">
      <div className="mb-4 space-y-1">
        <div className="text-xl font-bold">Change network.</div>
        <div className="ld-text-gray-500 text-sm">
          Connect to the correct network to continue
        </div>
      </div>
      <SwitchNetwork
        onSwitch={() => setShowWrongNetworkModal(false)}
        toChainId={CHAIN_ID}
      />
    </div>
  );
};

export default WrongNetwork;
