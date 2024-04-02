import { algorithms } from '@lensshare/data/algorithms';
import type { HomeFeedType } from '@lensshare/data/enums';
import { HOME } from '@lensshare/data/tracking';
import { TabButton } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useEnabledAlgorithmsStore } from 'src/store/persisted/useEnabledAlgorithmsStore';


interface FeedTypeProps {
  setFeedType: Dispatch<SetStateAction<HomeFeedType>>;
  feedType: HomeFeedType;
}

const Tabs: FC<FeedTypeProps> = ({ setFeedType, feedType }) => {
  const enabledAlgorithms = useEnabledAlgorithmsStore(
    (state) => state.enabledAlgorithms
  );
  const sanitizedEnabledAlgorithms = algorithms.filter((a) => {
    return enabledAlgorithms.includes(a.feedType);
  });

  if (sanitizedEnabledAlgorithms.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 sm:px-0">
      {sanitizedEnabledAlgorithms.map((algorithm) => {
        return (
          <TabButton
            key={algorithm.feedType}
            name={algorithm.name}
            icon={
              <img
                className="h-4 w-4 rounded"
                src={algorithm.image}
                alt={algorithm.name}
              />
            }
            active={feedType === algorithm.feedType}
            showOnSm
            onClick={() => {
              setFeedType(algorithm.feedType as HomeFeedType);
  
            }}
          />
        );
      })}
    </div>
  );
};

export default Tabs;
