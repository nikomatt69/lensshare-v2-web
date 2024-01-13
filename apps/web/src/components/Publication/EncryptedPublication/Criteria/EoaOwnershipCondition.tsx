import type { EoaOwnershipCondition as EoaOwnershipConditionType } from '@lensshare/lens';
import type { FC } from 'react';

import formatAddress from '@lensshare/lib/formatAddress';
import { Tooltip } from '@lensshare/ui';
import useEnsName from 'src/hooks/useEnsName';

interface EoaOwnershipConditionProps {
  condition: EoaOwnershipConditionType;
}

const EoaOwnershipCondition: FC<EoaOwnershipConditionProps> = ({
  condition
}) => {
  const { ens } = useEnsName({
    address: condition.address,
    enabled: Boolean(condition.address)
  });
  const ensName = condition.address === ens ? null : ens;

  return (
    <div className="flex items-center space-x-2">
      <div>Must own the EVM Address:</div>
      <div>
        <Tooltip content={condition.address}>
          {formatAddress(condition.address)} {ensName ? `(${ensName})` : null}
        </Tooltip>
      </div>
    </div>
  );
};

export default EoaOwnershipCondition;
