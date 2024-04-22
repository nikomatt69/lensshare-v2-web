import type {
  ExplorePublicationRequest,
  Post,
  PrimaryPublication
} from '@lensshare/lens';
import {
  ExplorePublicationType,
  ExplorePublicationsOrderByType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsLazyQuery,
  usePublicationLazyQuery
} from '@lensshare/lens';
import Loader from '@components/Shared/Loader';
import { EmptyState } from '@lensshare/ui';
import { useRouter } from 'next/router';
import { useInView } from 'react-cool-inview';
import {
  APP_ID,
  LENSTER_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN,
  STATIC_ASSETS_URL,
  TAPE_APP_ID
} from '@lensshare/data/constants';
import { useEffect, useState } from 'react';
import imageKit from '@lensshare/lib/imageKit';
import Audio from './Audio';

const ListenFeed = () => {
  const request: ExplorePublicationRequest = {
    where: {
      publicationTypes: [ExplorePublicationType.Post],
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.Audio],
        publishedOn: [
          APP_ID,
          LENSTER_APP_ID,
          LENSTUBE_BYTES_APP_ID,
          TAPE_APP_ID
        ]
      }
    },
    orderBy: ExplorePublicationsOrderByType.LensCurated,
    limit: LimitType.Fifty
  };
  const router = useRouter();
  const [currentViewingId, setCurrentViewingId] = useState('');

  const [
    fetchPublication,
    { data: singleAudioData, loading: singleAudioLoading }
  ] = usePublicationLazyQuery();

  const [fetchAllBytes, { data, loading, error, fetchMore }] =
    useExplorePublicationsLazyQuery({
      variables: {
        request
      },
      onCompleted: ({ explorePublications }) => {
        const items = explorePublications?.items as Post[];
        const publicationId = router.query.id;
        if (!publicationId && items[0]?.id) {
          const nextUrl = `${location.origin}/listen/${items[0]?.id}`;
          history.pushState({ path: nextUrl }, '', nextUrl);
        }
      }
    });

  const pageInfo = data?.explorePublications?.pageInfo;
  const audio = data?.explorePublications?.items as PrimaryPublication[];
  const singleAudio = singleAudioData?.publication as PrimaryPublication;

  const fetchSingleByte = async () => {
    const publicationId = router.query.id;
    if (!publicationId) {
      return fetchAllBytes();
    }
    await fetchPublication({
      variables: {
        request: { forId: publicationId }
      },
      onCompleted: () => fetchAllBytes()
    });
  };

  useEffect(() => {
    if (router.isReady) {
      fetchSingleByte();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const { observe } = useInView({
    threshold: 0.25,
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

  if (audio?.length === 0) {
    return <EmptyState message={'No echoes found'} icon />;
  }

  return (
    <div>
      {!error && !loading && audio && (
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
            {singleAudio && <Audio audio={singleAudio} />}
            {audio?.map(
              (audio, index) =>
                singleAudio?.id !== audio.id && (
                  <Audio audio={audio?.id} key={`${audio?.id}_${index}`} />
                )
            )}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center border-0 p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default ListenFeed;
