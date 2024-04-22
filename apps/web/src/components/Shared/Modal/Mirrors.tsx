import UserProfile from '@components/Shared/UserProfile';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { FollowUnfollowSource } from '@lensshare/data/tracking';
import type { Profile, ProfilesRequest } from '@lensshare/lens';
import { LimitType, useProfilesQuery } from '@lensshare/lens';
import { EmptyState, ErrorMessage } from '@lensshare/ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { Virtuoso } from 'react-virtuoso';

import Loader from '../Loader';

interface MirrorsProps {
  publicationId: string;
}

const Mirrors: FC<MirrorsProps> = ({ publicationId }) => {
  // Variables
  const request: ProfilesRequest = {
    where: { whoMirroredPublication: publicationId },
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore } = useProfilesQuery({
    variables: { request },
    skip: !publicationId
  });

  const profiles = data?.profiles?.items;
  const pageInfo = data?.profiles?.pageInfo;
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
    return <Loader message="Loading mirrors" />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          message="No mirrors."
          icon={<ArrowsRightLeftIcon className="text-brand h-8 w-8" />}
          hideCard
        />
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <ErrorMessage
        title="Failed to load mirrors"
        error={error}
        className="m-5"
      />
      <Virtuoso
        className="virtual-profile-list"
        data={profiles}
        endReached={onEndReached}
        itemContent={(index, profile) => {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-5"
            >
              <UserProfile
                profile={profile as Profile}
                isFollowing={profile.operations.isFollowedByMe.value}
                followUnfollowPosition={index + 1}
                followUnfollowSource={FollowUnfollowSource.MIRRORS_MODAL}
                showBio
                showFollow
                showUserPreview={false}
              />
            </motion.div>
          );
        }}
      />
    </div>
  );
};

export default Mirrors;
