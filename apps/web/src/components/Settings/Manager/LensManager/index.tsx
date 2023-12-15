import { APP_NAME } from '@lensshare/data/constants';
import checkDispatcherPermissions from '@lensshare/lib/checkDispatcherPermissions';
import { Card } from '@lensshare/ui';
import type { FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';

import ToggleLensManager from './ToggleLensManager';

const LensManager: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { canUseSignless } = checkDispatcherPermissions(currentProfile);

  return (
    <Card className="linkify space-y-2 p-5">
      <div className="space-y-3 pb-2">
        <div className="text-lg font-bold">
          {canUseSignless
            ? 'Disable signless transactions'
            : 'Signless transactions'}
        </div>
        <p>
          You can enable Lens manager to interact with {APP_NAME} without
          signing any of your transactions.
        </p>
      </div>
      <ToggleLensManager />
    </Card>
  );
};

export default LensManager;
