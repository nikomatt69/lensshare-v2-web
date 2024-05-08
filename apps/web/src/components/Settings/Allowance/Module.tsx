import { POLYGONSCAN_URL } from '@lensshare/data/constants';
import { OpenActionModuleType, type ApprovedAllowanceAmountResult } from '@lensshare/lens';
import { Card } from '@lensshare/ui';
import getAllowanceModule from '@lib/getAllowanceModule';
import Link from 'next/link';
import type { FC } from 'react';
import { useState } from 'react';

import AllowanceButton from './Button';
import getAllowanceOpenAction from '@lib/getAllowanceOpenAction';

interface ModuleProps {
  module: ApprovedAllowanceAmountResult;
}

const Module: FC<ModuleProps> = ({ module }) => {
  const [allowed, setAllowed] = useState(
    parseFloat(module?.allowance.value) > 0
  );

  return (
    <Card
    className="block items-center justify-between p-5 sm:flex"
    forceRounded
    key={module?.moduleName}
  >
    <div className="mb-3 mr-1.5 overflow-hidden sm:mb-0">
      <div className="whitespace-nowrap font-bold">
        {module.moduleName === OpenActionModuleType.UnknownOpenActionModule
          ? getAllowanceOpenAction(module?.moduleContract.address).name
          : getAllowanceModule(module?.moduleName).name}
      </div>
      <Link
        className="ld-text-gray-500 truncate text-sm"
        href={`${POLYGONSCAN_URL}/address/${module?.moduleContract.address}`}
        rel="noreferrer noopener"
        target="_blank"
      >
        {module?.moduleContract.address}
      </Link>
    </div>
    <AllowanceButton
      allowed={allowed}
      module={module}
      setAllowed={setAllowed}
    />
  </Card>
  );
};

export default Module;
