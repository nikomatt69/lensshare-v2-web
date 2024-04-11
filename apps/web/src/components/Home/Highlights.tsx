import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import type { AnyPublication, FeedHighlightsRequest } from '@lensshare/lens';
import { LimitType, useFeedHighlightsQuery } from '@lensshare/lens';
import { OptmisticPublicationType } from '@lensshare/types/enums';
import { Card, EmptyState, ErrorMessage } from '@lensshare/ui';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { Virtuoso } from 'react-virtuoso';
import { useImpressionsStore } from 'src/store/non-persisted/useImpressionsStore';
import { useTimelineStore } from 'src/store/non-persisted/useTimelineStore';
import { useAppStore } from 'src/store/persisted/useAppStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';

const Highlights: FC = () => {
  const { currentProfile } = useAppStore();
  const { txnQueue } = useTransactionStore();
  const { seeThroughProfile } = useTimelineStore();
  const { fetchAndStoreViews } = useImpressionsStore();

  // Variables
  const request: FeedHighlightsRequest = {
    limit: LimitType.TwentyFive,
    where: { for: seeThroughProfile?.id || currentProfile?.id }
  };

  const { data, error, fetchMore, loading } = useFeedHighlightsQuery({
    onCompleted: async ({ feedHighlights }) => {
      const ids = feedHighlights?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
    },
    variables: { request }
  });

  const publications = data?.feedHighlights?.items;
  const pageInfo = data?.feedHighlights?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    const { data } = await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
    const ids = data?.feedHighlights?.items?.map((p) => p.id) || [];
    await fetchAndStoreViews(ids);
  };

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        icon={<LightBulbIcon className="h-8 w-8" />}
        message="No posts yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load highlights" />;
  }

  return (
    <>
      {txnQueue.map((txn) =>
        txn?.type === OptmisticPublicationType.Post ? (
          <QueuedPublication key={txn.txId} txn={txn} />
        ) : null
      )}
      <Card>
        <Virtuoso
          className="virtual-divider-list-window"
          computeItemKey={(index, publication) => `${publication.id}-${index}`}
          data={publications}
          endReached={onEndReached}
          itemContent={(index, publication) => {
            return (
              <SinglePublication
                isFirst={index === 0}
                isLast={index === (publications?.length || 0) - 1}
                publication={publication as AnyPublication}
              />
            );
          }}
          useWindowScroll
        />
      </Card>
    </>
  );
};

export default Highlights;