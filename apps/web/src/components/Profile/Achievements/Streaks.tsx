import { LENSSHARE_API_URL } from '@lensshare/data/constants';
import type { Profile } from '@lensshare/lens';
import getProfile from '@lensshare/lib/getProfile';
import { Card } from '@lensshare/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import type { Activity } from 'react-activity-calendar';
import ActivityCalendar from 'react-activity-calendar';

interface StreaksProps {
  profile: Profile;
}

const Streaks: FC<StreaksProps> = ({ profile }) => {
  const fetchStreaks = async () => {
    try {
      const response = await axios.get(
        `${LENSSHARE_API_URL}/stats/streaksCalendar`,
        {
          params: { id: profile.id }
        }
      );

      const outputData = Object.entries(response.data.data).map(
        ([date, count]: any) => ({
          date,
          count,
          level: count > 0 ? Math.min(Math.floor(count / 10) + 1, 4) : 0
        })
      );

      return outputData;
    } catch {
      return [];
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fetchStreaks', profile.id],
    queryFn: fetchStreaks
  });

  return (
    <Card className="p-6">
      <ActivityCalendar
        data={data as Activity[]}
        loading={isLoading}
        colorScheme="light"
        blockRadius={50}
        labels={{
          totalCount: `${
            getProfile(profile).slugWithPrefix
          } has {{count}} activities in ${new Date().getFullYear()}`
        }}
        theme={{ light: ['#FED5D9', '#000fff'] }}
      />
    </Card>
  );
};

export default Streaks;
