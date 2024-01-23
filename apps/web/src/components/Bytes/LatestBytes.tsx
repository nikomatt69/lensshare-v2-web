import { APP_ID, APP_NAME, FALLBACK_COVER_URL, TAPE_APP_ID } from '@lensshare/data/constants';
import type {
  ExplorePublicationRequest,
  PrimaryPublication
} from '@lensshare/lens';
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@lensshare/lens';
import getAvatar from '@lensshare/lib/getAvatar';
import getProfile from '@lensshare/lib/getProfile';
import imageKit from '@lensshare/lib/imageKit';
import Link from 'next/link';
import React from 'react';
import { getPublicationData } from 'src/hooks/getPublicationData';
import { getThumbnailUrl } from 'src/hooks/getThumbnailUrl';
import LatestBytesShimmer from './LatestBytesShimmer';

const request: ExplorePublicationRequest = {
  where: {
    publicationTypes: [ExplorePublicationType.Post],

    metadata: {
      mainContentFocus: [PublicationMetadataMainFocusType.ShortVideo],
      publishedOn: [TAPE_APP_ID, APP_ID, APP_NAME]
    }
  },
  orderBy: ExplorePublicationsOrderByType.LensCurated,
  limit: LimitType.Ten
};

const LatestBytes = () => {
  const { data, error, loading } = useExplorePublicationsQuery({
    variables: { request }
  });

  const bytes = data?.explorePublications?.items as PrimaryPublication[];

  if (loading) {
    return <LatestBytesShimmer />;
  }

  if (!bytes?.length || error) {
    return null;
  }

  return (
    <>
      {bytes.map((byte) => {
        return (
          <div className="flex flex-col rounded-xl" key={byte.id}>
            <Link
              href={`/bytes/${byte.id}`}
              className="ultrawide:w-[260px] ultrawide:h-[400px] relative aspect-[9/16] h-[350px] w-[220px] flex-none overflow-hidden rounded-xl"
            >
              <img
                className="h-full object-cover"
                src={imageKit(getThumbnailUrl(byte.metadata))}
                alt="thumbnail"
                height={1000}
                width={600}
                draggable={false}
                onError={({ currentTarget }) => {
                  currentTarget.src = FALLBACK_COVER_URL;
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 rounded-b-xl bg-gradient-to-b from-transparent to-transparent px-4 py-2">
                <h1 className="line-clamp-2 break-all text-sm font-bold text-gray-200">
                  {getPublicationData(byte.metadata)?.title}
                </h1>
              </div>
            </Link>
            <span>
              <Link
                href={getProfile(byte.by)?.link}
                className="inline-flex items-center space-x-1 px-3 py-1"
              >
                <img
                  className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-800"
                  src={getAvatar(byte.by)}
                  height={50}
                  width={50}
                  alt={`${getProfile(byte.by)?.slug}'s PFP`}
                  draggable={false}
                />
                <span className="flex items-center space-x-1 font-medium">
                  <span>{getProfile(byte.by)?.slug}</span>
                </span>
              </Link>
            </span>
          </div>
        );
      })}
    </>
  );
};

export default LatestBytes;
