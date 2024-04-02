import Markup from '@components/Shared/Markup';
import SmallUserProfile from '@components/Shared/SmallUserProfile';
import type { Profile } from '@lensshare/lens';
import {
  LensTransactionStatusType,
  PublicationDocument,
  useLensTransactionStatusQuery,
  usePublicationLazyQuery
} from '@lensshare/lens';
import { useApolloClient } from '@lensshare/lens/apollo';
import getMentions from '@lensshare/lib/getMentions';
import type { OptimisticTransaction } from '@lensshare/types/misc';
import { Card, Tooltip } from '@lensshare/ui';
import type { FC } from 'react';
import { useAppStore } from 'src/store/persisted/useAppStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';

interface QueuedPublicationProps {
  txn: OptimisticTransaction;
}

const QueuedPublication: FC<QueuedPublicationProps> = ({ txn }) => {
  const { currentProfile } = useAppStore();
  const { removeTransaction } = useTransactionStore();

  const { cache } = useApolloClient();
  const txHash = txn?.txHash;
  const txId = txn?.txId;

  const removeTxn = () => {
    if (txn.txId) {
      return removeTransaction(txn.txId);
    }
  };

  const [getPublication] = usePublicationLazyQuery({
    onCompleted: ({ publication }) => {
      if (publication) {
        cache.modify({
          fields: {
            publications: () => {
              cache.writeQuery({
                data: publication,
                query: PublicationDocument
              });
            }
          }
        });
      }
    }
  });

  useLensTransactionStatusQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: async ({ lensTransactionStatus }) => {
      if (lensTransactionStatus?.status === LensTransactionStatusType.Failed) {
        return removeTxn();
      }

      if (
        lensTransactionStatus?.status === LensTransactionStatusType.Complete
      ) {
        if (txn.commentOn) {
          await getPublication({
            variables: { request: { forTxHash: lensTransactionStatus.txHash } }
          });
        }
        removeTxn();
      }
    },
    pollInterval: 1000,
    variables: {
      request: {
        ...(txHash && { forTxHash: txHash }),
        ...(txId && { forTxId: txId })
      }
    }
  });

  if (!txn.content) {
    return null;
  }

  return (
    <Card as="article" className="p-5">
      <div className="flex items-start justify-between pb-4">
        <SmallUserProfile linkToProfile profile={currentProfile as Profile} />
        <Tooltip content="Indexing" placement="top">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200">
            <div className="animate-shimmer size-2 rounded-full bg-gray-500" />
          </div>
        </Tooltip>
      </div>
      <div className="markup linkify text-md break-words">
        <Markup mentions={getMentions(txn.content)}>{txn.content}</Markup>
      </div>
    </Card>
  );
};

export default QueuedPublication;
