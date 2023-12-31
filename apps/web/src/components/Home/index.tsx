/* eslint-disable react/jsx-no-useless-fragment */
import MetaTags from '@components/Common/MetaTags';
import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import Footer from '@components/Shared/Footer';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import { HomeFeedType } from '@lensshare/data/enums';
import { GridItemEight, GridItemFour, GridLayout, Image } from '@lensshare/ui';
import type { NextPage } from 'next';
import { useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';

import AlgorithmicFeed from './AlgorithmicFeed';
import Tabs from './Algorithms/Tabs';
import EnableLensManager from './EnableLensManager';
import FeedType from './FeedType';
import Hero from './Hero';
import Highlights from './Highlights';
import SetProfile from './SetProfile';
import Timeline from './Timeline';
import Waitlist from './Waitlist';
import { useTheme } from 'next-themes';
import EnableMessages from './EnableMessages';
import RefreshButton from './Refresh';
import Trending from './Trending';
import RecommendedProfiles from './RecommendedProfiles';
import Wrapper from '@components/Echos/Wrapper';

const Home: NextPage = (publication) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState<HomeFeedType>(
    HomeFeedType.FOLLOWING
  );

  const loggedIn = Boolean(currentProfile);
  const loggedOut = !loggedIn;
  const { resolvedTheme } = useTheme();

  return (
    <>
      <MetaTags />
      {!currentProfile ? <Hero /> : null}
      <Wrapper />
      <GridLayout>
        <GridItemEight>
          <>
            {resolvedTheme === 'dark' ? (
              <Image
                className="cursor-pointer"
                src={`${STATIC_ASSETS_URL}/images/Lenstoknewlogo3.png`}
                alt="logo"
              />
            ) : (
              <Image
                className="cursor-pointer"
                src={`${STATIC_ASSETS_URL}/images/Lenstoknewlogo.png`}
                alt="logo"
              />
            )}
          </>
        </GridItemEight>
        <GridItemEight className="space-y-5">
          {currentProfile ? (
            <>
              <NewPost />

              <div className="space-y-3">
                <FeedType feedType={feedType} setFeedType={setFeedType} />
                <RefreshButton />
                <Tabs feedType={feedType} setFeedType={setFeedType} />
              </div>
              {feedType === HomeFeedType.FOLLOWING ? (
                <Timeline />
              ) : feedType === HomeFeedType.HIGHLIGHTS ? (
                <Highlights />
              ) : feedType === HomeFeedType.ALGO ? (
                <AlgorithmicFeed feedType={feedType} />
              ) : (
                <ExploreFeed />
              )}
            </>
          ) : (
            <ExploreFeed />
          )}
        </GridItemEight>
        <GridItemFour>
          {/* <Gitcoin /> */}
          {loggedOut && <Waitlist />}
          {/* Onboarding steps */}
          {loggedIn && (
            <>
              <Trending />
              <RecommendedProfiles />
              <EnableMessages />
              <EnableLensManager />
              <SetProfile />
            </>
          )}
          {/* Recommendations */}
          <Footer />
        </GridItemFour>
      </GridLayout>
    </>
  );
};

export default Home;
