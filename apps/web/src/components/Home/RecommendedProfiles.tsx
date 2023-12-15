import DismissRecommendedProfile from '@components/Shared/DismissRecommendedProfile';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import {
  EllipsisHorizontalCircleIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { FollowUnfollowSource, MISCELLANEOUS } from '@lensshare/data/tracking';
import type { Profile } from '@lensshare/lens';
import { useProfileRecommendationsQuery } from '@lensshare/lens';
import { Card, EmptyState, ErrorMessage, Modal } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useTimelineStore } from 'src/store/useTimelineStore';

import Suggested from './Suggested';

const Title = () => {
  return (
    <div className="mb-2 flex items-center gap-2 px-5 sm:px-0">
      <SparklesIcon className="h-4 w-4 text-yellow-500" />
      <div>Who to follow</div>
    </div>
  );
};

const RecommendedProfiles: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const seeThroughProfile = useTimelineStore(
    (state) => state.seeThroughProfile
  );
  const [showSuggestedModal, setShowSuggestedModal] = useState(false);

  const { data, loading, error } = useProfileRecommendationsQuery({
    variables: {
      request: { for: seeThroughProfile?.id ?? currentProfile?.id }
    }
  });

  if (loading) {
    return (
      <>
        <Title />
        <Card className="space-y-4 p-5">
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
        </Card>
      </>
    );
  }

  if (data?.profileRecommendations.items.length === 0) {
    return (
      <>
        <Title />
        <EmptyState
          message="No recommendations!"
          icon={<UsersIcon className="text-brand h-8 w-8" />}
        />
      </>
    );
  }

  const recommendedProfiles = data?.profileRecommendations.items.filter(
    (profile) => !profile.operations.isBlockedByMe.value
  );

  return (
    <>
      <Title />
      <Card as="aside">
        <div className="space-y-4 p-5">
          <ErrorMessage title="Failed to load recommendations" error={error} />
          {recommendedProfiles?.slice(0, 5)?.map((profile, index) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={profile?.id}
              className="flex items-center space-x-3 truncate"
            >
              <div className="w-full">
                <UserProfile
                  profile={profile as Profile}
                  isFollowing={profile.operations.isFollowedByMe.value}
                  followUnfollowPosition={index + 1}
                  followUnfollowSource={FollowUnfollowSource.WHO_TO_FOLLOW}
                  showFollow
                />
              </div>
              <DismissRecommendedProfile
                profile={profile as Profile}
                dismissPosition={index + 1}
                dismissSource={FollowUnfollowSource.WHO_TO_FOLLOW}
              />
            </motion.div>
          ))}
        </div>
        <button
          className="flex w-full items-center space-x-2 rounded-b-xl border-t bg-gray-50 px-5 py-3 text-left text-sm text-gray-600 hover:bg-gray-100 dark:border-t-gray-700 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-900"
          type="button"
          onClick={() => {
            setShowSuggestedModal(true);
  
          }}
        >
          <EllipsisHorizontalCircleIcon className="h-4 w-4" />
          <span>Show more</span>
        </button>
      </Card>
      <Modal
        title="Suggested for you"
        icon={<UsersIcon className="text-brand h-5 w-5" />}
        show={showSuggestedModal}
        onClose={() => setShowSuggestedModal(false)}
      >
        <Suggested />
      </Modal>
    </>
  );
};

export default RecommendedProfiles;
