import { OpenAction } from '@lensshare/data/enums';
import { type FC } from 'react';


import TipConfig from './Config/Tip';
import { useOpenActionStore } from 'src/store/non-persisted/useOpenActionStore';
import SwapConfig from './Config/Swap';
import RentableBillboardConfig from './Config/RentableBillboard';

const OpenActionsConfig: FC = () => {
  const { selectedOpenAction } = useOpenActionStore();

  return (
    <div>
      {selectedOpenAction === OpenAction.Tip && <TipConfig />}
      {selectedOpenAction === OpenAction.RentableBillboard && (
        <RentableBillboardConfig />
      )}
      {selectedOpenAction === OpenAction.Swap && <SwapConfig />}
    </div>
  );
};

export default OpenActionsConfig;

