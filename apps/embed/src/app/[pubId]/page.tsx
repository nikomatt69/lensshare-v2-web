
import type { AnyPublication } from '@lensshare/lens'
import { PublicationDocument } from '@lensshare/lens'
import { apolloClient } from '@lensshare/lens/apollo'

import Custom404 from '@/components/Custom404'
import Publication from '@/components/Publication'
import { getPublication } from '@/components/getPublication'
import { isListenable } from '@/components/isListenable'
import { isWatchable } from '@/components/isWatchable'

type Props = {
  params: { pubId: string }
}

const client = apolloClient()

export default async function Page({ params }: Props) {
  const { pubId } = params
  const { data, error } = await client.query({
    query: PublicationDocument,
    variables: { request: { forId: pubId } }
  })

  if (!data.publication || error) {
    return <Custom404 />
  }

  const publication = data.publication as AnyPublication
  const targetPublication = getPublication(publication)
  const isAudio = isListenable(targetPublication)
  const isVideo = isWatchable(targetPublication)

  if (!isAudio && !isVideo) {
    return <Custom404 />
  }

  return <Publication publication={targetPublication} />
}
