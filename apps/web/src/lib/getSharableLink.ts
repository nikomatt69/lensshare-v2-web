
import { APP_NAME, BASE_URL, LENSSHARE_TWITTER_HANDLE } from '@lensshare/data/constants'
import type { MirrorablePublication } from '@lensshare/lens'
import { getPublicationData } from 'src/hooks/getPublicationData'



type Link = 'lensshare' | 'hey' | 'x' | 'reddit' | 'linkedin'

export const getSharableLink = (
  link: Link,
  publication: MirrorablePublication
) => {
  const fullHandle = publication.by.handle?.fullHandle
  const { metadata } = publication
  const isAudio = metadata?.__typename === 'AudioMetadataV3'

  const url = `${BASE_URL}/${isAudio ? 'listen' : 'posts'}/${
    publication.id
  }`

  if (link === 'lensshare') {
    return `${BASE_URL}/posts/${publication.id}`
  } else if (link === 'hey') {
    return `${BASE_URL}/?url=${url}&text=${
      (getPublicationData(metadata)?.title as string) ?? ''
    } by @${fullHandle}&hashtags=${APP_NAME}&preview=true`
  } else if (link === 'x') {
    return encodeURI(
      `https://x.com/intent/tweet?url=${url}&text=${
        (getPublicationData(metadata)?.title as string) ?? ''
      } by @${fullHandle}&via=${LENSSHARE_TWITTER_HANDLE}&related=${APP_NAME}&hashtags=${APP_NAME}`
    )
  } else if (link === 'reddit') {
    return `https://www.reddit.com/submit?url=${url}&title=${
      (getPublicationData(metadata)?.title as string) ?? ''
    } by @${fullHandle}`
  } else if (link === 'linkedin') {
    return `https://www.linkedin.com/shareArticle/?url=${url} by @${fullHandle}&title=${
      (getPublicationData(metadata)?.title as string) ?? ''
    }&summary=${
      getPublicationData(metadata)?.content as string
    }&source=${APP_NAME}`
  }
  return ''
}
