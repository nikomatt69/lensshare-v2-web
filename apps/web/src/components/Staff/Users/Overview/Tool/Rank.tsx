import type { FC } from 'react';


import {
  CheckCircleIcon,
  CurrencyDollarIcon,
  HandRaisedIcon,
  UserCircleIcon,
  UserIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { HashtagIcon } from '@heroicons/react/24/solid';
import { GITCOIN_PASSPORT_KEY } from '@lensshare/data/constants';
import formatDate from '@lensshare/lib/datetime/formatDate';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import urlcat from 'urlcat';
import MetaDetails from '@components/StaffTools/Panels/MetaDetails';

interface RankProps {
  address: string;
  handle?: string;
  lensClassifierScore: number;
  profileId: string;
}

const Rank: FC<RankProps> = ({
  address,
  handle,
  lensClassifierScore,
  profileId
}) => {
  const getRank = async (strategy: string) => {
    try {
      const response = await axios.get(
        urlcat('https://lens-api.k3l.io/profile/rank', { handle, strategy })
      );

      return response.data;
    } catch {
      return false;
    }
  };

  const getGitcoinScore = async () => {
    try {
      const response = await axios.get(
        urlcat('https://api.scorer.gitcoin.co/registry/score/:id/:address', {
          address,
          id: 335
        }),
        { headers: { 'X-API-Key': GITCOIN_PASSPORT_KEY } }
      );

      return response.data;
    } catch {
      return false;
    }
  };

  const { data: followship, isLoading: followshipLoading } = useQuery({
    queryFn: async () => await getRank('followship'),
    queryKey: ['getRank', profileId, 'followship']
  });

  const { data: engagement, isLoading: engagementLoading } = useQuery({
    queryFn: async () => await getRank('engagement'),
    queryKey: ['getRank', profileId, 'engagement']
  });

  const { data: influencer, isLoading: influencerLoading } = useQuery({
    queryFn: async () => await getRank('influencer'),
    queryKey: ['getRank', profileId, 'influencer']
  });

  const { data: creator, isLoading: creatorLoading } = useQuery({
    queryFn: async () => await getRank('creator'),
    queryKey: ['getRank', profileId, 'creator']
  });

  const { data: gitcoinScore, isLoading: gitcoinScoreLoading } = useQuery({
    queryFn: getGitcoinScore,
    queryKey: ['getGitcoinScore', profileId]
  });

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <HashtagIcon className="h-5 w-5" />
        <div className="text-lg font-bold">Scores</div>
      </div>
      <div className="mt-3 space-y-2">
        <MetaDetails
          icon={<UserIcon className="ld-text-gray-500 h-4 w-4" />}
          title="Lens Classifier Score" value={''}        >
          {lensClassifierScore}
        </MetaDetails>
        <MetaDetails
          icon={<UserPlusIcon className="ld-text-gray-500 h-4 w-4" />}
          title="Followship Rank" value={''}        >
          {followshipLoading ? (
            <div className="shimmer h-4 w-5 rounded" />
          ) : followship ? (
            followship.rank
          ) : (
            'Not ranked'
          )}
        </MetaDetails>
        <MetaDetails
          icon={<HandRaisedIcon className="ld-text-gray-500 h-4 w-4" />}
          title="Engagement Rank" value={''}        >
          {engagementLoading ? (
            <div className="shimmer h-4 w-5 rounded" />
          ) : engagement ? (
            engagement.rank
          ) : (
            'Not ranked'
          )}
        </MetaDetails>
        <MetaDetails
          icon={<UserCircleIcon className="ld-text-gray-500 h-4 w-4" />}
          title="Influencer Rank" value={''}        >
          {influencerLoading ? (
            <div className="shimmer h-4 w-5 rounded" />
          ) : influencer ? (
            influencer.rank
          ) : (
            'Not ranked'
          )}
        </MetaDetails>
        <MetaDetails
          icon={<CurrencyDollarIcon className="ld-text-gray-500 h-4 w-4" />}
          title="Creator Rank" value={''}        >
          {creatorLoading ? (
            <div className="shimmer h-4 w-5 rounded" />
          ) : creator ? (
            creator.rank
          ) : (
            'Not ranked'
          )}
        </MetaDetails>
        <MetaDetails
          icon={<CheckCircleIcon className="ld-text-gray-500 h-4 w-4" />}
          title="Gitcoin Score"  value={''}        >
          {gitcoinScoreLoading ? (
            <div className="shimmer h-4 w-5 rounded" />
          ) : gitcoinScore ? (
            <span>
              {parseInt(gitcoinScore?.evidence?.rawScore) > 0 ? (
                <>
                  {parseFloat(gitcoinScore?.evidence?.rawScore).toFixed(2)}
                  <span className="ld-text-gray-500 text-xs">
                    {' '}
                    (Updated: {formatDate(gitcoinScore?.last_score_timestamp)})
                  </span>
                </>
              ) : (
                'Not scored'
              )}
            </span>
          ) : (
            'Not scored'
          )}
        </MetaDetails>
        {gitcoinScore?.stamp_scores &&
        Object.keys(gitcoinScore?.stamp_scores).length > 0 ? (
          <div className="ld-text-gray-500 ml-5 space-y-1 text-xs">
            {Object.keys(gitcoinScore.stamp_scores).map((key) => {
              return (
                <div key={key}>
                  <b className="ml-1">{key}: </b>
                  {gitcoinScore?.stamp_scores[key]}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Rank;
