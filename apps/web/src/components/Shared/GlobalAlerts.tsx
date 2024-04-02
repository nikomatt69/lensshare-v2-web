import ModAction from '@components/Publication/Actions/ModAction';
import { Alert } from '@lensshare/ui';
import type { FC } from 'react';

import BlockOrUnBlockProfile from './Alert/BlockOrUnBlockProfile';
import DeletePublication from './Alert/DeletePublication';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

const GlobalAlerts: FC = () => {
  const {
    blockingorUnblockingProfile,
    modingPublication,
    setShowGardenerActionsAlert,
    showGardenerActionsAlert
  } = useGlobalAlertStateStore();
  return (
    <>
      <DeletePublication />
      {modingPublication ? (
        <Alert
          onClose={() => setShowGardenerActionsAlert(false, null)}
          show={showGardenerActionsAlert}
          title="Mod actions"
          description="Perform mod actions on this publication."
        >
          <ModAction publication={modingPublication} />
        </Alert>
      ) : null}
      {blockingorUnblockingProfile ? <BlockOrUnBlockProfile /> : null}
    </>
  );
};

export default GlobalAlerts;
