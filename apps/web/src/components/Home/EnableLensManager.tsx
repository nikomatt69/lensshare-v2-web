import ToggleLensManager from '@components/Settings/Manager/LensManager/ToggleLensManager';
import { HandRaisedIcon } from '@heroicons/react/24/outline';
import { APP_NAME } from '@lensshare/data/constants';
import checkDispatcherPermissions from '@lensshare/lib/checkDispatcherPermissions';
import { Card } from '@lensshare/ui';
import type { FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useAccount } from 'wagmi';

const EnableLensManager: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { address } = useAccount();
  const { canUseSignless } = checkDispatcherPermissions(currentProfile);

  if (canUseSignless || currentProfile?.ownedBy.address !== address) {
    return null;
  }

  return (
    <Card
      as="aside"
      className="border-brand-400 !bg-brand-300/20 text-brand-600 mb-4 space-y-2.5 p-5"
    >
      <div className="flex items-center space-x-2 font-bold">
        <HandRaisedIcon className="h-5 w-5" />
        <p>Signless transactions</p>
      </div>
      <p className="text-sm leading-[22px]">
        You can enable Lens manager to interact with {APP_NAME} without signing
        any of your transactions.
      </p>
      <ToggleLensManager buttonSize="sm" />
    </Card>
  );
};

export default EnableLensManager;
