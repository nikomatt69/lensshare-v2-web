/* eslint-disable react/no-children-prop */
/* eslint-disable react/jsx-no-useless-fragment */
import MetaTags from '@components/Common/MetaTags';
import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import Footer from '@components/Shared/Footer';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import { HomeFeedType } from '@lensshare/data/enums';
import { Card, GridItemEight, GridItemFour, GridLayout, Image } from '@lensshare/ui';
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
import { useTheme } from 'next-themes';

import RecommendedProfiles from './RecommendedProfiles';
import FeaturedGroup from '@components/Publication/FeaturedGroup';
import ListenFeed from '@components/Listen/Curated';
import { AnyPublication, usePublicationQuery } from '@lensshare/lens';
import { getPublication } from 'src/hooks/getPublication';
import { useRouter } from 'next/router';
import Wrapper from '@components/Echos/Wrapper';
import CuratedHome from '@components/Echos/CuratedHome';
import SpacesWindowBottomBar from '@components/Spaces/SpacesWindow/SpacesWindowBottomBar';


const Home: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState<HomeFeedType>(
    HomeFeedType.FOLLOWING
  );
  const {
    query: { id }
  } = useRouter();

  const { data, error, loading } = usePublicationQuery({
    variables: {
      request: { forId: id }
    },
    skip: !id
  });

  

  const publication = data?.publication as AnyPublication;
  const audio = getPublication(publication);
  const loggedIn = Boolean(currentProfile);
  const loggedOut = !loggedIn;
  const { resolvedTheme } = useTheme();

  return (
    <>
      <MetaTags />
      {!currentProfile ? <Hero /> : null}

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

          {/* Onboarding steps */}
          {loggedIn && (
            <>
              <FeaturedGroup tags={undefined} />

              
              
              
                
                
              <RecommendedProfiles />
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
