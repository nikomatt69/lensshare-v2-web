

import { Profile } from '@lensshare/lens'

import { imageCdn } from './imageCdn'
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl'
import { IMAGE_TRANSFORMATIONS } from '@lensshare/data/constants'
import getStampFyiURL from '@lensshare/lib/getStampFyiURL'


export const getProfilePicture = (
  profile: Profile | null,
  type?: keyof typeof IMAGE_TRANSFORMATIONS,
  withFallback = true
): string => {
  if (!profile) {
    return ''
  }
  const url =
    profile.metadata?.picture?.__typename === 'ImageSet'
      ? profile.metadata?.picture?.optimized?.uri
      : profile.metadata?.picture?.__typename === 'NftImage'
      ? profile?.metadata.picture.image?.optimized?.uri
      : withFallback
      ? getStampFyiURL(profile?.ownedBy.address)
      : null
  const sanitized = sanitizeDStorageUrl(url)
  return imageCdn(sanitized, type)
}

export const getProfilePictureUri = (profile: Profile | null): string => {
  if (!profile) {
    return ''
  }
  const url =
    profile.metadata?.picture?.__typename === 'ImageSet'
      ? profile.metadata?.picture?.raw?.uri
      : profile.metadata?.picture?.__typename === 'NftImage'
      ? profile?.metadata.picture.image?.raw?.uri
      : null
  return url
}
