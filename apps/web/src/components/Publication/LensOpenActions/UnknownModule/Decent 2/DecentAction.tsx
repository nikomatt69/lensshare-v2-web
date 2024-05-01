
import type { FC } from 'react';

import LoginButton from '@components/Shared/Navbar/LoginButton';

import { LinkIcon } from '@heroicons/react/24/outline';
import { Button, Spinner } from '@lensshare/ui';

import Link from 'next/link';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { Amount } from '@lensshare/lens';
import cn from '@lensshare/ui/cn';
import MetaDetails from '@components/StaffTools/Panels/MetaDetails';

interface DecentActionProps {
  act: () => void;
  allowanceLoading?: boolean;
  className?: string;
  isReadyToMint?: boolean;
  isLoading?: boolean;
  moduleAmount?: Amount;
  txHash?: string;
}

const DecentAction: FC<DecentActionProps> = ({
  act,
  allowanceLoading,
  className = '',
  isLoading = false,
  isReadyToMint,
  moduleAmount,
  txHash
}) => {
  const { address } = useAccount();

  const amount = parseInt(moduleAmount?.value || '0');
  const assetAddress = moduleAmount?.asset?.contract.address;
  const assetDecimals = moduleAmount?.asset?.decimals || 18;
  const assetSymbol = moduleAmount?.asset?.symbol;
  const loadingState: boolean = isLoading;

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

  if (!address) {
    return (
      <div className="w-full">
        <LoginButton isBig  />
      </div>
    );
  }

  if (allowanceLoading) {
    return (
      <div className={cn('shimmer h-[34px] w-28 rounded-lg', className)} />
    );
  }

  if (!hasAmount) {
    return (
      <Button
        className="w-full border-gray-300 bg-gray-300 text-gray-600 hover:bg-gray-300 hover:text-gray-600"
        disabled={true}
        size="lg"
      >
        {`Insufficient ${assetSymbol} balance`}
      </Button>
    );
  }

  return (
    <>
      <Button
        className={className}
        disabled={loadingState}
        icon={loadingState ? <Spinner size="xs" /> : null}
        onClick={(e) => {
          e.stopPropagation();
          act();
        }}
      >
        <div>
          {loadingState
            ? 'Pending'
            : !isReadyToMint
            ? `Approve minting for ${moduleAmount?.value} ${moduleAmount?.asset.symbol}`
            : `Mint for ${moduleAmount?.value} ${moduleAmount?.asset.symbol}`}
        </div>
      </Button>
      {txHash ? (
        <>
          <MetaDetails
            icon={<LinkIcon className="ld-text-gray-500 h-4 w-4" />}
            title="PolygonScan"
            value={`https://polygonscan.com/tx/${txHash}`}
          >
            <Link
              href={`https://polygonscan.com/tx/${txHash}`}
              rel="noreferrer"
              target="_blank"
            >
              Open
            </Link>
          </MetaDetails>
          <MetaDetails
            icon={<LinkIcon className="ld-text-gray-500 h-4 w-4" />}
            title="LayerZeroScan"
            value={`https://layerzeroscan.com/tx/${txHash}`}
          >
            <Link
              href={`https://layerzeroscan.com/tx/${txHash}`}
              rel="noreferrer"
              target="_blank"
            >
              Open
            </Link>
          </MetaDetails>
        </>
      ) : null}
    </>
  );
};

export default DecentAction;
