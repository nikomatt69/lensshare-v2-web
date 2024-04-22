import MetaTags from '@components/Common/MetaTags';
import Sidebar from '@components/Shared/Sidebar';
import { PencilSquareIcon, UsersIcon } from '@heroicons/react/24/outline';
import { PAGEVIEW } from '@lensshare/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Custom404 from 'src/pages/404';
import { useEffectOnce } from 'usehooks-ts';

import Profiles from './Profiles';
import Publications from './Publications';

const Search: NextPage = () => {
  const { query } = useRouter();
  const searchText = Array.isArray(query.q)
    ? encodeURIComponent(query.q.join(' '))
    : encodeURIComponent(query.q || '');


  if (!query.q || !['pubs', 'profiles'].includes(query.type as string)) {
    return <Custom404 />;
  }

  return (
    <>
      <MetaTags />
      <GridLayout>
        <GridItemFour>
          <Sidebar
            items={[
              {
                title: 'Publications',
                icon: <PencilSquareIcon className="h-4 w-4" />,
                url: `/search?q=${searchText}&type=pubs`,
                active: query.type === 'pubs'
              },
              {
                title: 'Profiles',
                icon: <UsersIcon className="h-4 w-4" />,
                url: `/search?q=${searchText}&type=profiles`,
                active: query.type === 'profiles'
              }
            ]}
          />
        </GridItemFour>
        <GridItemEight>
          {query.type === 'profiles' ? (
            <Profiles query={query.q as string} />
          ) : null}
          {query.type === 'pubs' ? (
            <Publications query={query.q as string} />
          ) : null}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default Search;
