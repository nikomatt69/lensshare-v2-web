import type {
  Amount,
  ApprovedAllowanceAmountResult,
  UnknownOpenActionModuleSettings
} from '@lensshare/lens';
import type { FC, ReactNode } from 'react';

import AllowanceButton from '@components/Settings/Allowance/Button';
import LoginButton from '@components/Shared/Navbar/LoginButton';
import NoBalanceError from '@components/Shared/NoBalanceError';
import { useApprovedModuleAllowanceAmountQuery } from '@lensshare/lens';
import { Button, Spinner, WarningMessage } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import getCurrentSession from '@lib/getCurrentSession';
import { useState } from 'react';
import { formatUnits, isAddress } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';

interface TipActionProps {
  act: () => void;
  className?: string;
  icon: ReactNode;
  isLoading?: boolean;
  module: UnknownOpenActionModuleSettings;
  moduleAmount?: Amount;
  title: string;
}

const TipAction: FC<TipActionProps> = ({
  act,
  className = '',
  icon,
  isLoading = false,
  module,
  moduleAmount,
  title
}) => {
  const [allowed, setAllowed] = useState(true);
  const currentSessionProfileId = getCurrentSessionProfileId();
  const isWalletUser = isAddress(currentSessionProfileId);

  const { address } = useAccount();

  const amount = parseInt(moduleAmount?.value || '0');
  const assetAddress = moduleAmount?.asset?.contract.address;
  const assetDecimals = moduleAmount?.asset?.decimals || 18;

  const { data: allowanceData, loading: allowanceLoading } =
    useApprovedModuleAllowanceAmountQuery({
      fetchPolicy: 'no-cache',
      onCompleted: ({ approvedModuleAllowanceAmount }) => {
        if (!amount) {
          return;
        }

        const allowedAmount = parseFloat(
          approvedModuleAllowanceAmount[0]?.allowance.value
        );
        setAllowed(allowedAmount > amount);
      },
      skip: !amount || !currentSessionProfileId || !assetAddress,
      variables: {
        request: {
          currencies: [assetAddress],
          unknownOpenActionModules: [module.contract.address]
        }
      }
    });

  const { data: balanceData } = useBalance({
    address,

    token: assetAddress
  });

  let hasAmount = false;
  if (
    balanceData &&
    parseFloat(formatUnits(balanceData.value, assetDecimals)) < amount
  ) {
    hasAmount = false;
  } else {
    hasAmount = true;
  }

  if (!currentSessionProfileId) {
    return (
      <div className="mt-5">
        <LoginButton />
      </div>
    );
  }

  if (isWalletUser) {
    return null;
  }

  if (allowanceLoading) {
    return (
      <div className={cn('shimmer mt-5 h-[34px] w-28 rounded-lg', className)} />
    );
  }

  if (!allowed) {
    return (
      <AllowanceButton
        allowed={allowed}
        module={
          allowanceData
            ?.approvedModuleAllowanceAmount[0] as ApprovedAllowanceAmountResult
        }
        setAllowed={setAllowed}
        title="Enable open action"
      />
    );
  }

  if (!hasAmount) {
    return (
      <WarningMessage
        className="mt-5 w-full"
        message={<NoBalanceError moduleAmount={moduleAmount as Amount} />}
      />
    );
  }

  return (
    <Button
      className={cn('mt-5', className)}
      disabled={isLoading}
      icon={isLoading ? <Spinner size="xs" /> : icon}
      onClick={act}
    >
      {title}
    </Button>
  );
};

export default TipAction;
