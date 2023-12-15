import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import type {
  AnyPublication,
  ExplorePublicationRequest
} from '@lensshare/lens';
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  useExplorePublicationsQuery
} from '@lensshare/lens';
import type { Group } from '@lensshare/types/hey';
import { Card, EmptyState, ErrorMessage } from '@lensshare/ui';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';

interface FeedProps {
  group: Group;
}

const Feed: FC<FeedProps> = ({ group }) => {
  const request: ExplorePublicationRequest = {
    where: {
      publicationTypes: [ExplorePublicationType.Post],
      metadata: { tags: { oneOf: group.tags } }
    },
    orderBy: ExplorePublicationsOrderByType.Latest,
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore } = useExplorePublicationsQuery({
    variables: { request },
    skip: !group.id
  });

  const publications = data?.explorePublications?.items;
  const pageInfo = data?.explorePublications?.pageInfo;
  const hasMore = pageInfo?.next;

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

  if (publications?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">{group.name}</span>
            <span>don't have any publications yet</span>
          </div>
        }
        icon={<RectangleStackIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load group feed" error={error} />;
  }

  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      {publications?.map((publication, index) => (
        <SinglePublication
          key={`${publication.id}_${index}`}
          isFirst={index === 0}
          isLast={index === publications.length - 1}
          publication={publication as AnyPublication}
        />
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </Card>
  );
};

export default Feed;
