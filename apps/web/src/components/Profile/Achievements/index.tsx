import type { Profile } from '@lensshare/lens';
import type { FC } from 'react';

import Streaks from './Streaks';
import StreaksList from './StreaksList';
import ProfileAnalytics from './ProfileAnalytics';

interface AchievementsProps {
  profile: Profile;
}

const Achievements: FC<AchievementsProps> = ({ profile }) => {
  return (
    <div className="space-y-4">
      <ProfileAnalytics profile={profile} />
      <Streaks profile={profile} />
      <StreaksList profile={profile} />
    </div>
  );
};

export default Achievements;
