import MetaTags from '@components/Common/MetaTags';
import RecommendedProfiles from '@components/Home/RecommendedProfiles';
import Footer from '@components/Shared/Footer';
import { APP_NAME } from '@lensshare/data/constants';
import type { PublicationMetadataMainFocusType } from '@lensshare/lens';
import { GridItemEight, GridItemFour, GridLayout } from '@lensshare/ui';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';

import LatestBytes from '@components/Bytes/LatestBytes';

import ListenFeed from './Curated';
import HorizantalScroller from '@components/Explore/HorizantalScroller';

const ListenFeedRender: NextPage = () => {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [focus, setFocus] = useState<PublicationMetadataMainFocusType>();

  return (
    <GridLayout className="mt-8">
      <MetaTags
        title={`Music • ${APP_NAME}`}
        description={`Explore top commented, collected and latest publications in the ${APP_NAME}.`}
      />
      <GridItemEight className="space-y-5 ">
        <div className="flex flex-col">
          <HorizantalScroller
            sectionRef={sectionRef}
            heading="Trending Bytes"
          />
          <div
            ref={sectionRef}
            className="no-scrollbar laptop:pt-6 relative flex items-start space-x-4 overflow-x-auto overflow-y-hidden scroll-smooth rounded-xl pt-4"
          >
            <LatestBytes />
          </div>
        </div>
        <ListenFeed />
      </GridItemEight>
      <GridItemFour>
       
        {currentProfile ? <RecommendedProfiles /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default ListenFeedRender;
