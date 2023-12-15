import UserProfilesShimmer from '@components/Shared/Shimmer/UserProfilesShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import type { Profile, ProfileSearchRequest } from '@lensshare/lens';
import {
  CustomFiltersType,
  LimitType,
  useSearchProfilesQuery
} from '@lensshare/lens';
import { Card, EmptyState, ErrorMessage } from '@lensshare/ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { Virtuoso } from 'react-virtuoso';

interface ProfilesProps {
  query: string;
}

const Profiles: FC<ProfilesProps> = ({ query }) => {
  // Variables
  const request: ProfileSearchRequest = {
    where: { customFilters: [CustomFiltersType.Gardeners] },
    query,
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore } = useSearchProfilesQuery({
    variables: { request },
    skip: !query
  });

  const search = data?.searchProfiles;
  const profiles = search?.items;
  const pageInfo = search?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <UserProfilesShimmer isBig />;
  }

  if (profiles?.length === 0) {
    return (
      <EmptyState
        message={
          <span>
            No profiles for <b>&ldquo;{query}&rdquo;</b>
          </span>
        }
        icon={<UsersIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load profiles" error={error} />;
  }

  return (
    <Virtuoso
      useWindowScroll
      className="[&>div>div]:space-y-3"
      data={profiles}
      endReached={onEndReached}
      itemContent={(_, profile) => {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card key={profile?.id} className="p-5">
              <UserProfile profile={profile as Profile} showBio isBig />
            </Card>
          </motion.div>
        );
      }}
    />
  );
};

export default Profiles;
