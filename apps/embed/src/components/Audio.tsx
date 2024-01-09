

import { APP_NAME, BASE_URL, STATIC_ASSETS_URL } from '@lensshare/data/constants'
import type { PrimaryPublication } from '@lensshare/lens'
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import { getPublicationData } from '@lensshare/web/src/hooks/getPublicationData';
import { getThumbnailUrl } from '@lensshare/web/src/hooks/getThumbnailUrl';
import { imageCdn } from '@lensshare/web/src/hooks/imageCdn';
import Link from 'next/link'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useAverageColor } from '@lensshare/web/src/hooks/useAverageColor'

import AudioPlayer from '@lensshare/web/src/components/Listen/AudioPlayer'

import { PauseOutline } from './PauseOutline';
import { PlayButton } from '@livepeer/react';
import { PlayOutline } from './PlayOutline';
type Props = {
  audio: PrimaryPublication
}

const Audio: FC<Props> = ({ audio }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const coverImage = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(audio.metadata, true)),
    'SQUARE'
  )
  const { color: backgroundColor } = useAverageColor(coverImage, true)

  return (
    <div
      className="md:rounded-large rounded-small relative max-h-[350px] overflow-hidden p-4 md:p-6"
      style={{
        backgroundColor,
        backgroundImage: `url("${imageCdn(
          `${STATIC_ASSETS_URL}/images/fallback-cover.svg`
        )}")`
      }}
    >
      <div className="flex items-center space-x-6">
        <Link
          title={`Listen on ${APP_NAME}`}
          href={`${BASE_URL}/posts/${audio?.id}`}
          className="rounded-small aspect-[1/1] w-[150px] flex-none shadow-2xl md:w-[250px]"
        >
          <img
            src={coverImage}
            className="rounded-small tape-border object-cover"
            alt="audio cover"
            height={500}
            width={500}
            draggable={false}
          />
        </Link>
        <div className="w-full text-white md:space-y-4">
          <Link
            title={`Listen on ${APP_NAME}`}
            href={`${BASE_URL}/listen/${audio?.id}`}
            
            className="line-clamp-1 inline-block text-xl font-bold !leading-normal md:text-4xl"
          >
            {getPublicationData(audio.metadata)?.title}
          </Link>
          <p className="line-clamp-1 md:line-clamp-2">
            {getPublicationData(audio.metadata)?.content}
          </p>
          <div className="flex w-full items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-smoke rounded-full p-3 md:p-4"
            >
              {isPlaying ? (
                <PauseOutline className="size-5" />
              ) : (
                <PlayOutline className="size-5 pl-0.5" />
              )}
            </button>
            <div className="flex-1">
              <AudioPlayer
                isPlaying={isPlaying}
                url={getPublicationData(audio.metadata)?.asset?.uri ?? ''}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-4 md:right-6 md:top-5">
        <Link
          title={`Listen on ${APP_NAME}`}
          href={`${BASE_URL}/posts/${audio?.id}`}
          target="_blank"
          
        >
          <img
            src={`${STATIC_ASSETS_URL}/brand/logo.svg`}
            draggable={false}
            className="ml-0.5 size-6 md:size-10"
            alt={APP_NAME}
          />
        </Link>
      </div>
    </div>
  )
}

export default Audio
