import type { FC } from 'react';

import { OpenAction } from '@lensshare/data/enums';



import OpenActionItem from './OpenActionItem';
import OpenActionsConfig from './OpenActionsConfig';
import SaveOrCancel from './SaveOrCancel';
import { ScreenType, useOpenActionStore } from 'src/store/non-persisted/useOpenActionStore';
import { TipIcon } from '@components/Publication/LensOpenActions/UnknownModule/Tip/TipIcon';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

const OpenActionsList: FC = () => {
  const setShowModal = useOpenActionStore((state) => state.setShowModal);
  const screen = useOpenActionStore((state) => state.screen);
  const selectedOpenAction = useOpenActionStore(
    (state) => state.selectedOpenAction
  );

  return screen === ScreenType.List ? (
    <div className="p-5">
      <div className="mb-5 space-y-3">
        
          <OpenActionItem
            description="Add ability to swap"
            icon={<ArrowsRightLeftIcon className="size-6" />}
            title="Swap"
            type={OpenAction.Swap}
          />
        <OpenActionItem
          description="Add ability to tip"
          icon={<TipIcon className="size-6" />}
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
