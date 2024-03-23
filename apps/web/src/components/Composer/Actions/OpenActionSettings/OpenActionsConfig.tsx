import { OpenAction } from '@lensshare/data/enums';
import { type FC } from 'react';


import TipConfig from './Config/Tip';
import { useOpenActionStore } from 'src/store/non-persisted/useOpenActionStore';
import SwapConfig from './Config/Swap';

const OpenActionsConfig: FC = () => {
  const selectedOpenAction = useOpenActionStore(
    (state) => state.selectedOpenAction
  );

  return (
    <div>
      {selectedOpenAction === OpenAction.Tip && <TipConfig />}
      {selectedOpenAction === OpenAction.Swap && <SwapConfig />}
    </div>
  );
};

export default OpenActionsConfig;
