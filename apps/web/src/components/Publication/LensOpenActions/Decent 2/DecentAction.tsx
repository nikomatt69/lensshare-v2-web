import type {
  Amount,
  ApprovedAllowanceAmountResult,
  BroadcastOnchainMutation,
  UnknownOpenActionModuleSettings
} from '@lensshare/lens';
import type { FC } from 'react';

import AllowanceButton from '@components/Settings/Allowance/Button';
import LoginButton from '@components/Shared/Navbar/LoginButton';
import { useApprovedModuleAllowanceAmountQuery } from '@lensshare/lens';
import { Button, Spinner } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import getCurrentSession from '@lib/getCurrentSession';
import { useEffect, useState } from 'react';
import { formatUnits, isAddress } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import MetaDetails from '@components/StaffTools/Panels/MetaDetails';
import { LinkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import {
  getMessagesBySrcTxHash,
  MessageStatus
} from '@layerzerolabs/scan-client';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
interface DecentActionProps {
  act: () => void;
  className?: string;
  isLoading?: boolean;
  module: UnknownOpenActionModuleSettings;
  moduleAmount?: Amount;
  relayStatus?: BroadcastOnchainMutation;
  txHash?: string;
}

const DecentAction: FC<DecentActionProps> = ({
  act,
  className = '',
  isLoading = false,
  module,
  moduleAmount,
  relayStatus,
  txHash
}) => {
  const [allowed, setAllowed] = useState(true);
  const [pending, setPending] = useState(false);
  const  currentSessionProfileId  = getCurrentSessionProfileId();
  const isWalletUser = isAddress(currentSessionProfileId);

  const { address } = useAccount();

  const amount = parseInt(moduleAmount?.value || '0');
  const assetAddress = moduleAmount?.asset?.contract.address;
  const assetDecimals = moduleAmount?.asset?.decimals || 18;
  const assetSymbol = moduleAmount?.asset?.symbol;
  const polygonLayerZeroChainId = 109;
  const loadingState: boolean = isLoading || pending;

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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (txHash) {
      setPending(true);
      const fetchCrossChainStatus = async () => {
        const { messages } = await getMessagesBySrcTxHash(
          polygonLayerZeroChainId,
          txHash
        );
        console.log('LZ Cross-Chain Status');
        console.log(messages);
        const lastStatus = messages[messages.length - 1]?.status;
        if (lastStatus === MessageStatus.DELIVERED) {
          setPending(false);
          clearInterval(interval);
        }
      };

      interval = setInterval(fetchCrossChainStatus, 10000);
    }
    return () => clearInterval(interval);
  }, [txHash]);

  if (!currentSessionProfileId) {
    return (
      <div className="w-full">
        <LoginButton isBig />
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

  if (!allowed) {
    return (
      <AllowanceButton
        allowed={allowed}
        module={
          allowanceData
            ?.approvedModuleAllowanceAmount[0] as ApprovedAllowanceAmountResult
        }
        setAllowed={setAllowed}
        title={`Approve ${assetSymbol} Token Allowance`}
      />
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
            : `Pay with ${moduleAmount?.value} ${moduleAmount?.asset.symbol}`}
        </div>
      </Button>
      {txHash ? (
        <>
          <MetaDetails
            icon={<LinkIcon className="ld-text-gray-500 w-4 h-4" />}
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
            icon={<LinkIcon className="ld-text-gray-500 w-4 h-4" />}
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
