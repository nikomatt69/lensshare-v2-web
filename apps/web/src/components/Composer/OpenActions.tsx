import type { UnknownOpenActionModuleSettings } from '@lensshare/lens';
import type { FC } from 'react';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { VerifiedOpenActionModules } from '@lensshare/data/verified-openaction-modules';
import { useOpenActionStore } from 'src/store/non-persisted/useOpenActionStore';
import SwapOpenAction from '@components/Publication/LensOpenActions/UnknownModule/Swap';


const OpenActions: FC = () => {
  const { openAction, reset } = useOpenActionStore();

  const hasSwapOpenAction =
    openAction?.address === VerifiedOpenActionModules.Swap;

  if (!hasSwapOpenAction) {
    return null;
  }

  return (
    <div className="relative w-fit p-5">
      <SwapOpenAction
        module={
          {
            contract: { address: openAction.address },
            initializeCalldata: openAction.data
          } as UnknownOpenActionModuleSettings
        }
      />
      <div className="absolute right-0 top-0 m-2">
        <button
          className="rounded-full bg-gray-900 p-1.5 opacity-75"
          onClick={() => reset()}
          type="button"
        >
          <XMarkIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default OpenActions;
