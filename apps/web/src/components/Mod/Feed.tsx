import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import type {
  AnyPublication,
  CustomFiltersType,
  ExplorePublicationRequest,
  ExplorePublicationType,
  PublicationMetadataMainFocusType
} from '@lensshare/lens';
import {
  ExplorePublicationsOrderByType,
  LimitType,
  useExplorePublicationsQuery
} from '@lensshare/lens';
import { Card, EmptyState, ErrorMessage } from '@lensshare/ui';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useInView } from 'react-cool-inview';

interface FeedProps {
  refresh: boolean;
  setRefreshing: (refreshing: boolean) => void;
  publicationTypes: ExplorePublicationType[];
  mainContentFocus: PublicationMetadataMainFocusType[];
  customFilters: CustomFiltersType[];
  apps: string[] | null;
}

const Feed: FC<FeedProps> = ({
  refresh,
  setRefreshing,
  publicationTypes,
  mainContentFocus,
  customFilters,
  apps
}) => {
  // Variables
  const request: ExplorePublicationRequest = {
    where: {
      customFilters,
      publicationTypes,
      metadata: {
        mainContentFocus,
        ...(apps && { publishedOn: apps })
      }
    },
    orderBy: ExplorePublicationsOrderByType.Latest,
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore, refetch } =
    useExplorePublicationsQuery({ variables: { request } });

  const publications = data?.explorePublications?.items;
  const pageInfo = data?.explorePublications?.pageInfo;
  const hasMore = pageInfo?.next;

  useEffect(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, publicationTypes, mainContentFocus, customFilters]);

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
        message="No posts yet!"
        icon={<RectangleStackIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage title="Failed to load moderation feed" error={error} />
    );
  }

  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      {publications?.map((publication, index) => (
        <SinglePublication
          key={`${publication.id}_${index}`}
          isFirst={index === 0}
          isLast={index === publications.length - 1}
          publication={publication as AnyPublication}
          showThread={false}
          showActions={false}
          showModActions
        />
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </Card>
  );
};

export default Feed;
