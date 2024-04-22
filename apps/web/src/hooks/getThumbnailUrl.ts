import { FALLBACK_COVER_URL } from '@lensshare/data/constants';
import type { PublicationMetadata } from '@lensshare/lens';
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';

const getCover = (metadata: PublicationMetadata) => {
  switch (metadata.__typename) {
    case 'VideoMetadataV3':
      return metadata.asset.cover?.optimized?.uri;
    case 'AudioMetadataV3':
      return metadata.asset.cover?.optimized?.uri;
    default:
      return '';
  }
};

export const getThumbnailUrl = (
  metadata: PublicationMetadata,
  withFallback?: boolean
): string => {
  let url = getCover(metadata);

  if (withFallback) {
    url = url || FALLBACK_COVER_URL;
  }

  return sanitizeDStorageUrl(url);
};
