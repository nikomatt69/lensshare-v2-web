import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import type {
  AnyPublication,
  Comment,
  PublicationsRequest
} from '@lensshare/lens';
import {
  CommentRankingFilterType,
  CustomFiltersType,
  LimitType,
  usePublicationsQuery
} from '@lensshare/lens';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import { OptmisticPublicationType } from '@lensshare/types/enums';
import { Card, ErrorMessage } from '@lensshare/ui';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';


interface FeedProps {
  publication: AnyPublication;
}

const Feed: FC<FeedProps> = ({ publication }) => {
  const publicationId = isMirrorPublication(publication)
    ? publication?.mirrorOn?.id
    : publication?.id;
  const {txnQueue} = useTransactionStore();

  // Variables
  const request: PublicationsRequest = {
    where: {
      commentOn: {
        id: publicationId,
        ranking: { filter: CommentRankingFilterType.Relevant }
      },
      customFilters: [CustomFiltersType.Gardeners]
    },
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore } = usePublicationsQuery({
    variables: { request },
    skip: !publicationId
  });

  const comments = data?.publications?.items ?? [];
  const pageInfo = data?.publications?.pageInfo;
  const hasMore = pageInfo?.next;

  const queuedComments = txnQueue.filter(
    (o) =>
      o.type === OptmisticPublicationType.Comment &&
      o.commentOn === publicationId
  );
  const queuedCount = queuedComments.length;
  const hiddenCount = comments.filter(
    (o) => o?.__typename === 'Comment' && o.isHidden
  ).length;
  const hiddenRemovedComments = comments?.length - hiddenCount;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalComments = hiddenRemovedComments + queuedCount;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  });

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (error) {
    return <ErrorMessage title="Failed to load comment feed" error={error} />;
  }

  return (
    <>
       {queuedComments.map((txn) => (
        <QueuedPublication key={txn.txId} txn={txn} />
      ))}
      <Card className="divide-y-[1px] dark:divide-gray-700">
        {comments?.map((comment, index) =>
          comment?.__typename !== 'Comment' || comment.isHidden ? null : (
            <SinglePublication
              key={`${comment.id}`}
              isFirst={index === 0}
              isLast={index === comments.length - 1}
              publication={comment as Comment}
              showType={false}
            />
          )
        )}
        {hasMore ? <span ref={observe} /> : null}
      </Card>
    </>
  );
};

export default Feed;
