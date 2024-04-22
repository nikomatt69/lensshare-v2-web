import type { Profile } from '@lensshare/lens';
import type { FC } from 'react';

import Streaks from './Streaks';
import StreaksList from './StreaksList';
import ProfileAnalytics from './ProfileAnalytics';
import getProfile from '@lensshare/lib/getProfile';

interface AchievementsProps {
  profile: Profile;
}

const Achievements: FC<AchievementsProps> = ({ profile }) => {
  return (
    <div className="space-y-4">
      <Streaks
        handle={getProfile(profile).slugWithPrefix}
        profileId={profile.id}
      />
      <StreaksList profileId={profile.id} />
      (
        <ProfileAnalytics
          handle={profile?.handle?.localName}
          profileId={profile.id}
        />
      )
    </div>
  );
};

export default Achievements;
