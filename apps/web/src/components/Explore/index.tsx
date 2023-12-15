import MetaTags from '@components/Common/MetaTags';
import RecommendedProfiles from '@components/Home/RecommendedProfiles';
import Trending from '@components/Home/Trending';
import FeedFocusType from '@components/Shared/FeedFocusType';
import Footer from '@components/Shared/Footer';
import { Tab } from '@headlessui/react';
import { APP_NAME } from '@lensshare/data/constants';
import type { PublicationMetadataMainFocusType } from '@lensshare/lens';
import { ExplorePublicationsOrderByType } from '@lensshare/lens';
import { GridItemEight, GridItemFour, GridLayout } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { LightBulbIcon, SparklesIcon } from '@heroicons/react/24/outline';

import Feed from './Feed';
import MirrorOutline from '@components/Icons/MirrorOutline';
import ExploreOutline from '@components/Icons/ExploreOutline';
import LatestBytes from '@components/Bytes/LatestBytes';
import HorizantalScroller from './HorizantalScroller';

const Explore: NextPage = () => {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [focus, setFocus] = useState<PublicationMetadataMainFocusType>();

  const tabs = [
    {
      icon: <SparklesIcon className="h-6 w-6 text-blue-700" />,
      type: ExplorePublicationsOrderByType.LensCurated
    },
    {
      icon: <LightBulbIcon className="h-6 w-6 text-blue-700" />,
      type: ExplorePublicationsOrderByType.TopCommented
    },
    {
      icon: <ExploreOutline className="h-6 w-6 text-blue-700" />,
      type: ExplorePublicationsOrderByType.TopCollectedOpenAction
    },
    {
      icon: <MirrorOutline className="h-6 w-6 text-blue-700" />,
      type: ExplorePublicationsOrderByType.TopMirrored
    }
  ];

  return (
    <GridLayout>
      <MetaTags
        title={`Explore • ${APP_NAME}`}
        description={`Explore top commented, collected and latest publications in the ${APP_NAME}.`}
      />
      <GridItemEight className="space-y-5 ">
        <div className="flex flex-col">
          <HorizantalScroller
            sectionRef={sectionRef}
            heading="Today"
            subheading="New & Trending"
          />
          <div
            ref={sectionRef}
            className="no-scrollbar rounded-xl laptop:pt-6 relative flex items-start space-x-4 overflow-x-auto overflow-y-hidden scroll-smooth pt-4"
          >
            <LatestBytes />
          </div>
        </div>

        <Tab.Group
      
          defaultIndex={Number(router.query.tab)}
          onChange={(index) => {
            router.replace(
              { query: { ...router.query, tab: index } },
              undefined,
              { shallow: true }
            );
          }}
        >
          <Tab.List className="divider mx-auto  space-x-3">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.type}
                defaultChecked={index === 1}
                className={({ selected }) =>
                  cn(
                    {
                      'border-brand-500 border-b-2 !text-black dark:!text-white':
                        selected
                    },
                    'lt-text-gray-500 px-4 pb-2 text-xs font-medium outline-none sm:text-sm'
                  )
                }
              >
                {tab.icon}
              </Tab>
            ))}
          </Tab.List>
          <FeedFocusType focus={focus} setFocus={setFocus} />
          <Tab.Panels>
            {tabs.map((tab) => (
              <Tab.Panel key={tab.type}>
                <Feed focus={focus} feedType={tab.type} />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </GridItemEight>
      <GridItemFour>
        {currentProfile ? <Trending /> : null}
        {currentProfile ? <RecommendedProfiles /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Explore;
