import MetaTags from '@components/Common/MetaTags';


import FeedFocusType from '@components/Shared/FeedFocusType';
import Footer from '@components/Shared/Footer';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@lensshare/data/constants';
import type { PublicationMetadataMainFocusType } from '@lensshare/lens';
import { GridItemEight, GridItemFour, GridLayout } from '@lensshare/ui';
import type { NextPage } from 'next';
import { useState } from 'react';
import { useAppStore } from 'src/store/persisted/useAppStore';

import Feed from './Feed';

const Bookmarks: NextPage = () => {
  const { currentProfile } = useAppStore();
  const [focus, setFocus] = useState<PublicationMetadataMainFocusType>();

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Bookmarks • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <FeedFocusType focus={focus} setFocus={setFocus} />
        <Feed focus={focus} />
      </GridItemEight>
      <GridItemFour>

        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Bookmarks;
