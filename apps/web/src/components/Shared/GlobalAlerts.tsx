import ModAction from '@components/Publication/Actions/ModAction';
import { Alert } from '@lensshare/ui';
import type { FC } from 'react';
import { useGlobalAlertStateStore } from 'src/store/useGlobalAlertStateStore';

import BlockOrUnBlockProfile from './Alert/BlockOrUnBlockProfile';
import DeletePublication from './Alert/DeletePublication';

const GlobalAlerts: FC = () => {
  const {
    showModActionAlert,
    setShowModActionAlert,
    modingPublication,
    blockingorUnblockingProfile
  } = useGlobalAlertStateStore();

  return (
    <>
      <DeletePublication />
      {modingPublication ? (
        <Alert
          show={showModActionAlert}
          title="Mod actions"
          description="Perform mod actions on this publication."
          onClose={() => setShowModActionAlert(false, null)}
        >
          <ModAction publication={modingPublication} />
        </Alert>
      ) : null}
      {blockingorUnblockingProfile ? <BlockOrUnBlockProfile /> : null}
    </>
  );
};

export default GlobalAlerts;
