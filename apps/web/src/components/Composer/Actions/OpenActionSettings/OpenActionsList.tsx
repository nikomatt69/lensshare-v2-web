import type { FC } from 'react';

import { OpenAction } from '@lensshare/data/enums';



import OpenActionItem from './OpenActionItem';
import OpenActionsConfig from './OpenActionsConfig';
import SaveOrCancel from './SaveOrCancel';
import { ScreenType, useOpenActionStore } from 'src/store/non-persisted/useOpenActionStore';
import { TipIcon } from '@components/Publication/LensOpenActions/UnknownModule/Tip/TipIcon';
import { ArrowsRightLeftIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const OpenActionsList: FC = () => {
  const { screen, selectedOpenAction, setShowModal } = useOpenActionStore();

  return screen === ScreenType.List ? (
    <div className="p-5">
      <div className="mb-5 space-y-3">
        {(
          <OpenActionItem
            description="Swap any ERC-20 token"
            icon={<BanknotesIcon className="h-6 w-6" />}
            title="Token Swap"
            type={OpenAction.Swap}
          />
        )}
        <OpenActionItem
          description="Add ability to tip"
          icon={<TipIcon className="h-6 w-6" />}
          title="Tipping"
          type={OpenAction.Tip}
        />
      </div>
      <SaveOrCancel
        onSave={() => setShowModal(false)}
        saveDisabled={selectedOpenAction === null}
      />
    </div>
  ) : selectedOpenAction ? (
    <OpenActionsConfig />
  ) : null;
};

export default OpenActionsList;
