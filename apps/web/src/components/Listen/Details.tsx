
import Feed from '@components/Comment/Feed'
import PublicationActions from '@components/Publication/Actions'
import Markup from '@components/Shared/Markup'
import { PrimaryPublication } from '@lensshare/lens'
import getProfile from '@lensshare/lib/getProfile'
import type { FC } from 'react'
import React from 'react'
import { getProfilePicture } from 'src/hooks/getProfilePicture'
import { getPublicationData } from 'src/hooks/getPublicationData'
import HoverableProfile from './HoverableProfile'

type Props = {
  audio: PrimaryPublication
}

const Details: FC<Props> = ({ audio }) => {
  const metadata = getPublicationData(audio.metadata)

  return (
    <div className="px-4 py-10 lg:px-0">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="col-span-8">
          <h1 className="laptop:text-2xl text-xl font-bold">Artist</h1>
          <div className="mt-2 inline-block">
            <HoverableProfile
              profile={audio.by}
              fontSize="5"
              pfp={
                <img
                  src={getProfilePicture(audio.by, 'AVATAR')}
                  className="h-7 w-7 rounded-full"
                  draggable={false}
                  alt={getProfile(audio.by)?.displayName}
                />
              }
            />
          </div>
          {metadata?.content && (
            <div className="mt-6">
              <h1 className="laptop:text-2xl text-xl font-bold">Description</h1>
              <div className="mt-2">
               
              </div>
            </div>
          )}
        </div>
        <div className="col-span-4">
          <PublicationActions publication={audio} />
        </div>
      </div>
      <div className="mt-6">
        <Feed publication={audio} />
      </div>
    </div>
  )
}

export default Details
