
import { MirrorablePublication, PrimaryPublication } from '@lensshare/lens';
import { PublicationMainFocus, PublicationSortCriteria, PublicationTypes, useExploreFeedQuery } from '@lensshare/lens/generated3';
import { EmptyState } from '@lensshare/ui';
import React from 'react';
import { useInView } from 'react-cool-inview';
import EchosShimmer from './EchosShimmer';
import imageKit from '@lensshare/lib/imageKit';
import { SCROLL_ROOT_MARGIN, STATIC_ASSETS_URL } from '@lensshare/data/constants';
import Item from './Item';



const CuratedHome = () => {
  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    publicationTypes: [PublicationTypes.Post],

    metadata: {
      mainContentFocus: [PublicationMainFocus.Audio]
    }
  };

  const { data, loading, error, fetchMore } = useExploreFeedQuery({
    variables: { request }
  });

  const pageInfo = data?.explorePublications?.pageInfo;
  const videos = data?.explorePublications?.items as unknown as PrimaryPublication[];

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      });
    }
  });

  if (videos?.length === 0) {
    return <EmptyState message={'No echoes found'} icon />;
  }

  return (
    <div>
      {loading && <EchosShimmer />}
      {!error && !loading && videos && (
        <>
          <div className="mb-5 mt-3 flex items-center space-x-2">
            <img
              src={imageKit(`${STATIC_ASSETS_URL}/images/icon.png`)}
              draggable={false}
              className="h-12 w-12 md:h-16 md:w-16"
              alt="lensshare"
            />
            <h1 className="text-xl font-semibold">Music</h1>
          </div>
          <div className="desktop:grid-cols-6 ultrawide:grid-cols-7 laptop:grid-cols-4 mx-auto mt-4 grid grid-cols-2 place-items-center gap-2 md:grid-cols-3 md:gap-3">
            {videos?.map((publication: PrimaryPublication) => (
              <Item publication={publication} key={publication.id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CuratedHome;
