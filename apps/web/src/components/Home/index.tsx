/* eslint-disable react/no-children-prop */
/* eslint-disable react/jsx-no-useless-fragment */
import MetaTags from '@components/Common/MetaTags';
import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import Footer from '@components/Shared/Footer';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import { HomeFeedType } from '@lensshare/data/enums';
import { GridItemEight, GridItemFour, GridLayout, Image } from '@lensshare/ui';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
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
import type { AnyPublication } from '@lensshare/lens';
import { usePublicationQuery } from '@lensshare/lens';
import { getPublication } from 'src/hooks/getPublication';
import { useRouter } from 'next/router';

import PaidActions from './PaidActions/PaidActions index';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';
import { useClient } from '@xmtp/react-sdk';
import { useAccount, useWalletClient } from 'wagmi';
import { loadKeys } from '@lib/xmtp/keys';
import { useRoom } from '@huddle01/react/hooks';
import Meet from '@components/Meet/Meet';

const Home: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState<HomeFeedType>(
    HomeFeedType.FOLLOWING
  );
  const {
    query: { id }
  } = useRouter();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const initXmtp = async () => {
    if (!address) {
      return;
    }

    let keys = loadKeys(address);
    if (!keys) {
      return;
    }

    return await initialize({
      keys,
      options: { env: 'production' },
      signer: walletClient as any
    });
  };

  useEffect(() => {
    initXmtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, error, loading } = usePublicationQuery({
    variables: {
      request: { forId: id }
    },
    skip: !id
  });
  const { newConversationAddress, selectedConversation } = useMessagesStore();
  const { initialize, isLoading } = useClient();
  const publication = data?.publication as AnyPublication;
  const audio = getPublication(publication);
  const loggedIn = Boolean(currentProfile);
  const loggedOut = !loggedIn;
  const { resolvedTheme } = useTheme();
  const { isRoomJoined } = useRoom();
  const [isExpanded, setIsExpanded] = useState(false);
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
              ) : feedType === HomeFeedType.PREMIUM ? (
                <PaidActions />
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
              <RecommendedProfiles />
              <EnableLensManager />
              <SetProfile />

              <>
                <div className="flex justify-center">
                  {isRoomJoined ?<Meet />:null}
                </div>
              </>
            </>
          )}
          <Footer />
          {/* Recommendations */}
        </GridItemFour>
      </GridLayout>
    </>
  );
};

export default Home;
