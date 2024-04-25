import type { FC } from 'react';
import type { Address } from 'viem';

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { LensTransactionStatusType } from '@lensshare/lens';
import { Spinner } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { useTransactionStatus } from 'src/hooks/useIndexStatus';

interface IndexStatusProps {
  message?: string;
  reload?: boolean;
  txHash?: Address;
  txId?: string;
}

const IndexStatus: FC<IndexStatusProps> = ({
  message = 'Transaction Indexing',
  reload = false,
  txHash,
  txId
}) => {
  const { data, hide, loading } = useTransactionStatus({
    reload,
    txHash,
    txId
  });

  return (
    <span className={cn({ hidden: hide }, 'ml-auto text-sm font-medium')}>
      {loading ||
      !data?.lensTransactionStatus ||
      data?.lensTransactionStatus?.status ===
        LensTransactionStatusType.Processing ? (
        <div className="flex items-center space-x-1.5">
          <Spinner size="xs" />
          <div>{message}</div>
        </div>
      ) : data?.lensTransactionStatus?.status ===
        LensTransactionStatusType.Failed ? (
        <div className="flex items-center space-x-1.5">
          <XCircleIcon className="size-5 text-red-500" />
          <div>Index failed</div>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <CheckCircleIcon className="size-5 text-green-500" />
          <div className="text-black dark:text-white">Index Successful</div>
        </div>
      )}
    </span>
  );
};

export default IndexStatus;
