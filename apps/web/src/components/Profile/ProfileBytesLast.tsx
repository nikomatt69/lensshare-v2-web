import LatestBytesShimmer from '@components/Bytes/LatestBytesShimmer';
import Loader from '@components/Shared/Loader';
import {
  APP_ID,
  FALLBACK_COVER_URL,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN,
  TAPE_APP_ID
} from '@lensshare/data/constants';
import type { AnyPublication, Post, PublicationsRequest } from '@lensshare/lens';
import {
  LimitType,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublicationsQuery
} from '@lensshare/lens';
import imageKit from '@lensshare/lib/imageKit';
import { EmptyState } from '@lensshare/ui';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import { useInView } from 'react-cool-inview';
import { getPublicationData } from 'src/hooks/getPublicationData';
import { getThumbnailUrl } from 'src/hooks/getThumbnailUrl';

type Props = {
  profileId: string;
  publication: AnyPublication
};

const ProfileBytes: FC<Props> = ({ profileId ,publication}) => {
  const request: PublicationsRequest = {
    where: {
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.ShortVideo],
        publishedOn: [LENSTUBE_BYTES_APP_ID, APP_ID, TAPE_APP_ID]
      },
      publicationTypes: [PublicationType.Post],
      from: [profileId]
    },
    limit: LimitType.Fifty
  };

  const { data, loading, error, fetchMore } = usePublicationsQuery({
    variables: { request },
    skip: !profileId
  });

  const bytes = data?.publications?.items as Post[];
  const pageInfo = data?.publications?.pageInfo;

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

  if (loading) {
    return <LatestBytesShimmer count={4} />;
  }

  if (data?.publications?.items?.length === 0) {
    return <EmptyState message icon />;
  }

  return (
    <div className="w-full">
      {!error && !loading && (
        <div className="laptop:grid-cols-5 grid grid-cols-2 justify-center gap-2 md:grid-cols-3">
          {bytes.map((byte) => {
            return (
              <Link
                key={byte.id}
                href={`/bytes/${byte.id}`}
                className="hover:border-brand-500 rounded-large tape-border relative aspect-[9/16] w-full flex-none place-self-center overflow-hidden md:h-[400px]"
              >
                <img
                  className="h-full w-full rounded-xl object-cover"
                  src={imageKit(getThumbnailUrl(byte.metadata))}
                  alt="thumbnail"
                  draggable={false}
                  onError={({ currentTarget }) => {
                    currentTarget.src = FALLBACK_COVER_URL;
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 rounded-b-xl bg-gradient-to-b from-transparent to-black px-4 py-2">
                  <h1 className="line-clamp-2 break-words font-bold text-white">
                    {getPublicationData(byte.metadata)?.title}
                  </h1>
                </div>
                <div
                  className="absolute right-2 top-2"
                  onClick={(e) => e.stopPropagation()}
                />
              </Link>
            );
          })}
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileBytes;