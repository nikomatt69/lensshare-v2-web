import type { FC } from 'react';

import { OpenAction } from '@lensshare/data/enums';



import OpenActionItem from './OpenActionItem';
import OpenActionsConfig from './OpenActionsConfig';
import SaveOrCancel from './SaveOrCancel';
import { ScreenType, useOpenActionStore } from 'src/store/non-persisted/useOpenActionStore';
import { TipIcon } from '@components/Publication/LensOpenActions/UnknownModule/Tip/TipIcon';

const OpenActionsList: FC = () => {
  const setShowModal = useOpenActionStore((state) => state.setShowModal);
  const screen = useOpenActionStore((state) => state.screen);
  const selectedOpenAction = useOpenActionStore(
    (state) => state.selectedOpenAction
  );

  return screen === ScreenType.List ? (
    <div className="p-5">
      <OpenActionItem
        description="Add ability to tip"
        icon={<TipIcon className="w-6 h-6" />}
        title="Tipping"
        type={OpenAction.Tip}
      />
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
