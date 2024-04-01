import {
  CurrencyDollarIcon,
  LightBulbIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { IS_MAINNET } from '@lensshare/data/constants';
import { HomeFeedType } from '@lensshare/data/enums';
import { TabButton } from '@lensshare/ui';
import type { Dispatch, FC, SetStateAction } from 'react';

import Algorithms from './Algorithms';
import SeeThroughLens from './SeeThroughLens';
import GraphOutline from '@components/Icons/GraphOutline';
import FireOutline from '@components/Icons/FireOutline';

interface FeedTypeProps {
  setFeedType: Dispatch<SetStateAction<HomeFeedType>>;
  feedType: HomeFeedType;
}

const FeedType: FC<FeedTypeProps> = ({ setFeedType, feedType }) => {
  return (
    <div className="flex flex-wrap items-center justify-between px-1 md:px-0">
      <div className="flex gap-3 overflow-x-auto sm:px-0">
        <TabButton
          name="Following"
          icon={<UserGroupIcon className="h-4 w-4" />}
          active={feedType === HomeFeedType.FOLLOWING}
          onClick={() => {
            setFeedType(HomeFeedType.FOLLOWING);
          }}
        />
        <TabButton
          name="Highlights"
          icon={<LightBulbIcon className="h-4 w-4" />}
          active={feedType === HomeFeedType.HIGHLIGHTS}
          onClick={() => {
            setFeedType(HomeFeedType.HIGHLIGHTS);
          }}
        />
        <TabButton
          active={feedType === HomeFeedType.PREMIUM}
          icon={<CurrencyDollarIcon className="h-4 w-4" />}
          name="Premium"
          onClick={() => {
            setFeedType(HomeFeedType.PREMIUM);
          }}
        />
        <TabButton
          name="Most Viewed"
          icon={<GraphOutline className="h-4 w-4" />}
          active={feedType === HomeFeedType.HEY_MOSTVIEWED}
          onClick={() => {
            setFeedType(HomeFeedType.HEY_MOSTVIEWED);
          }}
        />
        <TabButton
          name="Most Recommended"
          icon={<FireOutline className="h-4 w-4" />}
          active={feedType === HomeFeedType.K3L_RECOMMENDED}
          onClick={() => {
            setFeedType(HomeFeedType.K3L_RECOMMENDED);
          }}
        />
      </div>
      <div className="flex items-center space-x-4">
        {feedType === HomeFeedType.FOLLOWING ||
        feedType === HomeFeedType.HIGHLIGHTS ? (
          <SeeThroughLens />
        ) : null}

        {IS_MAINNET ? <Algorithms /> : null}
      </div>
    </div>
  );
};

export default FeedType;
