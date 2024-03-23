import type { Amount } from '@lensshare/lens';
import type { FC } from 'react';
import { useTransactionStatus } from 'src/hooks/useIndexStatus';

import { Button, Spinner } from '@lensshare/ui';
import { useEffect, useState } from 'react';
import { LinkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import MetaDetails from '@components/StaffTools/Panels/MetaDetails';
import cn from '@lensshare/ui/cn';
import LoginButton from '@components/Shared/Navbar/LoginButton';
import { formatUnits, isAddress } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import {
  getMessagesBySrcTxHash,
  MessageStatus
} from '@layerzerolabs/scan-client';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import getCurrentSession from '@lib/getCurrentSession';
interface DecentActionProps {
  act: () => void;
  allowanceLoading?: boolean;
  className?: string;
  isLoading?: boolean;
  moduleAmount?: Amount;
  relayStatus?: string;
  txHash?: string;
}

const DecentAction: FC<DecentActionProps> = ({
  act,
  allowanceLoading,
  className = '',
  isLoading = false,
  moduleAmount,
  relayStatus,
  txHash
}) => {
  const [pending, setPending] = useState(false);
  const { id: sessionProfileId } = getCurrentSession();
  const isWalletUser = isAddress(sessionProfileId);

  const { address } = useAccount();

  const amount = parseInt(moduleAmount?.value || '0');
  const assetAddress = moduleAmount?.asset?.contract.address;
  const assetDecimals = moduleAmount?.asset?.decimals || 18;
  const assetSymbol = moduleAmount?.asset?.symbol;
  const polygonLayerZeroChainId = 109;
  const loadingState: boolean = isLoading || pending;

  const { data: balanceData } = useBalance({
    address,
    token: assetAddress
  });

  const { data: transactionStatusData } = useTransactionStatus({
    txHash: !!txHash ? (txHash as `0x${string}`) : undefined,
    txId: relayStatus
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (
      transactionStatusData &&
      !!transactionStatusData.lensTransactionStatus &&
      !!transactionStatusData.lensTransactionStatus.txHash
    ) {
      setPending(true);
      const fetchCrossChainStatus = async () => {
        const { messages } = await getMessagesBySrcTxHash(
          polygonLayerZeroChainId,
          transactionStatusData!.lensTransactionStatus!.txHash
        );
        const lastStatus = messages[messages.length - 1]?.status;
        if (lastStatus === MessageStatus.DELIVERED) {
          setPending(false);
          clearInterval(interval);
        }
      };

      interval = setInterval(fetchCrossChainStatus, 10000);
    }
    return () => clearInterval(interval);
  }, [transactionStatusData]);

  // TODO: Remove test condition
  // if (true) {
  //   return (
  //     <Button className={className} onClick={act}>
  //       <div>
  //         {`Mint for ${moduleAmount?.value} ${moduleAmount?.asset.symbol}`}
  //       </div>
  //     </Button>
  //   );
  // }

  if (!sessionProfileId) {
    return (
      <div className="w-full">
        <LoginButton isBig  />
      </div>
    );
  }

  if (isWalletUser) {
    return null;
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
        onClick={act}
      >
        <div>
          {loadingState
            ? 'Pending'
            : `Mint for ${moduleAmount?.value} ${moduleAmount?.asset.symbol}`}
        </div>
      </Button>
      {txHash ? (
        <>
          <MetaDetails
            icon={<LinkIcon className="ld-text-gray-500 size-4" />}
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
            icon={<LinkIcon className="ld-text-gray-500 size-4" />}
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