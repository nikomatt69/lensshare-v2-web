import { XMarkIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@lensshare/data/tracking';
import type { Profile } from '@lensshare/lens';
import { useDismissRecommendedProfilesMutation } from '@lensshare/lens';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';

interface DismissRecommendedProfileProps {
  profile: Profile;
  dismissSource?: string;
  dismissPosition?: number;
}

const DismissRecommendedProfile: FC<DismissRecommendedProfileProps> = ({
  profile,
  dismissSource,
  dismissPosition
}) => {
  const [dismissRecommendedProfile] = useDismissRecommendedProfilesMutation({
    variables: { request: { dismiss: [profile.id] } },
    update: (cache) => {
      cache.evict({ id: cache.identify(profile) });
    }
  });

  const handleDismiss = async () => {
    await dismissRecommendedProfile();

  };

  return (
    <button onClick={handleDismiss}>
      <XMarkIcon className="h-4 w-4 text-gray-500" />
    </button>
  );
};

export default DismissRecommendedProfile;
