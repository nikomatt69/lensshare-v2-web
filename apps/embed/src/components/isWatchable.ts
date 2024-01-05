import type { MirrorablePublication } from '@lensshare/lens'

export const isWatchable = (publication: MirrorablePublication) => {
  const canWatch =
    publication &&
    (publication.metadata.__typename === 'VideoMetadataV3' ||
      publication.metadata.__typename === 'LiveStreamMetadataV3') &&
    !publication?.isHidden

  return canWatch
}
