import MetaTags from '@components/Common/MetaTags';

import { useKeenSlider } from 'keen-slider/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-cool-inview';

import ByteVideo from './ByteVideo';
import { KeyboardControls, WheelControls } from './SliderPlugin';
import type {
  AnyPublication,
  ExplorePublicationRequest,
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
import {
  APP_ID,
  LENSTER_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  ORB_APP_ID,
  SCROLL_ROOT_MARGIN,
  TAPE_APP_ID
} from '@lensshare/data/constants';
import Loader from '@components/Shared/Loader';
import { EmptyState } from '@lensshare/ui';
import ChevronUpOutline from '@components/Icons/ChevronUpOutline';
import ChevronDownOutline from '@components/Icons/ChevronDownOutline';
import { getUnixTimestampForDaysAgo } from '@lib/formatTime';

const request: ExplorePublicationRequest = {
  where: {
    publicationTypes: [ExplorePublicationType.Post],
    metadata: {
      mainContentFocus: [PublicationMetadataMainFocusType.ShortVideo],
      publishedOn: [APP_ID, LENSTUBE_BYTES_APP_ID, TAPE_APP_ID]
    }
  },
  orderBy: ExplorePublicationsOrderByType.LensCurated,
  limit: LimitType.Fifty
};

const Bytes = () => {
  const since = getUnixTimestampForDaysAgo(30);

  const request: ExplorePublicationRequest = {
    where: {
      publicationTypes: [ExplorePublicationType.Post],
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.ShortVideo],
        publishedOn: [
          TAPE_APP_ID,
          ORB_APP_ID,
          APP_ID,
          LENSTER_APP_ID,
          LENSTUBE_BYTES_APP_ID
        ]
      },

      since
    },
    orderBy: ExplorePublicationsOrderByType.Latest,
    limit: LimitType.Fifty
  };
  const router = useRouter();
  const [currentViewingId, setCurrentViewingId] = useState('');

  const [sliderRef, { current: slider }] = useKeenSlider(
    {
      vertical: true,
      slides: { perView: 1, spacing: 10 }
    },
    [WheelControls, KeyboardControls]
  );

  const [
    fetchPublication,
    { data: singleByteData, loading: singleByteLoading }
  ] = usePublicationLazyQuery();

  const [fetchAllBytes, { data, loading, error, fetchMore }] =
    useExplorePublicationsLazyQuery({
      variables: {
        request
      },
      onCompleted: ({ explorePublications }) => {
        const items = explorePublications?.items as unknown as AnyPublication[];
        const publicationId = router.query.id;
        if (!publicationId && items[0]?.id) {
          const nextUrl = `${location.origin}/bytes/${items[0]?.id}`;
          history.pushState({ path: nextUrl }, '', nextUrl);
        }
      }
    });

  const bytes = data?.explorePublications?.items as unknown as AnyPublication[];
  const pageInfo = data?.explorePublications?.pageInfo;
  const singleByte = singleByteData?.publication as PrimaryPublication;

  const fetchSingleByte = async () => {
    const publicationId = router.query.id;
    if (!publicationId) {
      return fetchAllBytes();
    }
    await fetchPublication({
      variables: {
        request: { forId: publicationId }
      },
      onCompleted: () => fetchAllBytes(),
      fetchPolicy: 'network-only'
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

  if (loading || singleByteLoading) {
    return (
      <div className="grid h-[80vh] place-items-center">
        <Loader />
      </div>
    );
  }

  if (error || (!bytes?.length && !singleByte)) {
    return (
      <div className="grid h-[80vh] place-items-center">
        <EmptyState message icon />
      </div>
    );
  }

  return (
    <div className=" relative h-[calc(100vh-7rem)] overflow-y-hidden rounded-xl focus-visible:outline-none md:h-[calc(100vh-4rem)]">
      <MetaTags title="Bytes" />
      <div
        ref={sliderRef}
        className="keen-slider h-[calc(100vh-7rem)] snap-y snap-mandatory rounded-xl focus-visible:outline-none md:h-[calc(100vh-4rem)]"
      >
        {singleByte && (
          <ByteVideo
            publication={singleByte}
            currentViewingId={currentViewingId}
            intersectionCallback={(id) => setCurrentViewingId(id)}
          />
        )}
        {bytes?.map(
          (video, index) =>
            singleByte?.id !== video.id && (
              <ByteVideo
                publication={video as PrimaryPublication}
                currentViewingId={currentViewingId}
                intersectionCallback={(id) => setCurrentViewingId(id)}
                key={`${video?.id}_${index}`}
              />
            )
        )}
      </div>
      {pageInfo?.next && (
        <span ref={observe} className="flex justify-center p-10">
          <Loader />
        </span>
      )}
      <div className="laptop:right-6 ultrawide:right-8 bottom-2 right-4 hidden flex-col space-y-2 md:absolute md:flex">
        <button
          className="bg-gallery rounded-full p-3 focus:outline-none dark:bg-gray-800"
          onClick={() => slider?.prev()}
        >
          <ChevronUpOutline className="h-5 w-5" />
        </button>
        <button
          className="bg-gallery rounded-full p-3 focus:outline-none dark:bg-gray-800"
          onClick={() => slider?.next()}
        >
          <ChevronDownOutline className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Bytes;
