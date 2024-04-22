import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import type { AnyPublication, FeedItem, FeedRequest } from '@lensshare/lens';
import { FeedEventItemType, useFeedQuery } from '@lensshare/lens';
import { OptmisticPublicationType } from '@lensshare/types/enums';
import { Card, EmptyState, ErrorMessage } from '@lensshare/ui';
import { memo, type FC } from 'react';
import { useInView } from 'react-cool-inview';
import { Virtuoso } from 'react-virtuoso';
import { useImpressionsStore } from 'src/store/non-persisted/useImpressionsStore';
import { useTimelineStore } from 'src/store/non-persisted/useTimelineStore';
import { useAppStore } from 'src/store/persisted/useAppStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';

const Timeline: FC = () => {
  const { currentProfile, fallbackToCuratedFeed } = useAppStore();
  const { txnQueue } = useTransactionStore();
  const { seeThroughProfile } = useTimelineStore();
  const { fetchAndStoreViews } = useImpressionsStore();

  // Variables
  const request: FeedRequest = {
    where: {
      feedEventItemTypes: [
        FeedEventItemType.Acted,
        FeedEventItemType.Collect,
        FeedEventItemType.Mirror,
        FeedEventItemType.Post,
        FeedEventItemType.Quote,
        FeedEventItemType.Reaction
      ],
      for: fallbackToCuratedFeed
        ? 0x0214f6
        : seeThroughProfile?.id || currentProfile?.id
    }
  };

  const { data, error, fetchMore, loading } = useFeedQuery({
    fetchPolicy: 'cache-and-network',
    onCompleted: async ({ feed }) => {
      const ids =
        feed?.items?.flatMap((p) => {
          return [p.root.id].filter((id) => id);
        }) || [];
      await fetchAndStoreViews(ids);
    },
    variables: { request }
  });

  const feed = data?.feed?.items.filter(
    (item) => item.root.__typename !== 'Comment'
  );
  const pageInfo = data?.feed?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    const { data } = await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
    const ids =
      data.feed?.items?.flatMap((p) => {
        return [p.root.id].filter((id) => id);
      }) || [];
    await fetchAndStoreViews(ids);
  };

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (feed?.length === 0) {
    return (
      <EmptyState
        icon={<UserGroupIcon className="h-8 w-8" />}
        message="No posts yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load timeline" />;
  }

  return (
    <>
      {txnQueue.map((txn) =>
        txn?.type !== OptmisticPublicationType.Comment ? (
          <QueuedPublication key={txn.txId} txn={txn} />
        ) : null
      )}
      <Card>
        <Virtuoso
          className="virtual-divider-list-window"
          computeItemKey={(index, feedItem) => `${feedItem.id}-${index}`}
          data={feed}
          endReached={onEndReached}
          itemContent={(index, feedItem) => {
            return (
              <SinglePublication
                feedItem={feedItem as FeedItem}
                isFirst={index === 0}
                isLast={index === (feed?.length || 0) - 1}
                publication={feedItem.root as AnyPublication}
              />
            );
          }}
          useWindowScroll
        />
      </Card>
    </>
  );
};

export default memo(Timeline);
