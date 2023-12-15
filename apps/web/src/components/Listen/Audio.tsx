
import { PrimaryPublication } from '@lensshare/lens'
import {getPublicationData} from 'src/hooks/getPublicationData'
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl'

import { IconButton } from '@radix-ui/themes'

import type { FC } from 'react'
import React, { useState } from 'react'
import { getThumbnailUrl } from 'src/hooks/getThumbnailUrl'
import { imageCdn } from 'src/hooks/imageCdn'
import getProfile from '@lensshare/lib/getProfile'

import { getTimeFromSeconds } from 'src/hooks/formatTime2'
import { getProfilePicture } from 'src/hooks/getProfilePicture'
import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline'
import HoverableProfile from './HoverableProfile'
import AudioPlayer from './AudioPlayer'

type Props = {
  audio: PrimaryPublication
}

const Audio: FC<Props> = ({ audio }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const coverUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(audio?.metadata, true)),
    'SQUARE'
  )
  const metadata = getPublicationData(audio?.metadata)
  const duration = metadata?.asset?.duration

  return (
    <div>
      <div className="max-w-screen-laptop mx-auto grid place-items-center gap-6 py-10 md:grid-cols-2">
        <div className="relative flex aspect-[1/1] w-[250px] justify-center md:w-[350px]">
          <img
            src={coverUrl}
            className="rounded-small tape-border h-full w-full object-cover"
            alt="audio cover"
            height={500}
            width={500}
            draggable={false}
          />
          <div className="absolute inset-0 flex items-end justify-end space-x-1 p-3">
            <IconButton
              onClick={() => setIsPlaying(!isPlaying)}
              size="3"
              highContrast
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </IconButton>
          </div>
        </div>
        <div className="flex w-full flex-col items-center space-y-4 text-white lg:items-start">
          <h1 className="line-clamp-1 text-4xl font-bold leading-normal">
            {metadata?.title}
          </h1>
          <div className="flex items-center space-x-1">
            <div>
              <HoverableProfile
                profile={audio.by}
                fontSize="3"
                pfp={
                  <img
                    src={getProfilePicture(audio.by, 'AVATAR')}
                    className="h-5 w-5 rounded-full"
                    draggable={false}
                    alt={getProfile(audio.by)?.displayName}
                  />
                }
              />
            </div>
            <span className="middot" />
            <span className="text-sm">
              {getTimeFromSeconds(String(duration))}
            </span>
          </div>
        </div>
      </div>
      <div className="pb-4">
        <AudioPlayer
          isPlaying={isPlaying}
          url={getPublicationData(audio.metadata)?.asset?.uri ?? ''}
        />
      </div>
    </div>
  )
}

export default Audio
