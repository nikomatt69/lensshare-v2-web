import type { FC } from 'react';

import {
  LensTransactionStatusType,
  useLensTransactionStatusQuery
} from '@lensshare/lens';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';
import type { OptimisticTransaction } from '@lensshare/types/misc';

const OptimisticTransactionsProvider: FC = () => {
  const { removeTransaction, txnQueue } = useTransactionStore();

  const Transaction = ({
    transaction
  }: {
    transaction: OptimisticTransaction;
  }) => {
    useLensTransactionStatusQuery({
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ lensTransactionStatus }) => {
        if (
          lensTransactionStatus?.status === LensTransactionStatusType.Failed ||
          lensTransactionStatus?.status === LensTransactionStatusType.Complete
        ) {
          return removeTransaction(
            (transaction.txId || transaction.txHash) as string
          );
        }
      },
      pollInterval: 3000,
      variables: {
        request: {
          ...(transaction.txId && { forTxId: transaction.txId }),
          ...(transaction.txHash && { forTxHash: transaction.txHash })
        }
      }
    });

    return null;
  };

  return txnQueue.map((txn) => (
    <Transaction key={txn.txId || txn.txHash} transaction={txn} />
  ));
};

export default OptimisticTransactionsProvider;
