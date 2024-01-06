'use client'

import VideoPlayer from '@lensshare/web/src/utils/VideoPlayer';
import { APP_ID } from '@lensshare/data/constants'
import { getPublicationData } from '@lensshare/web/src/hooks/getPublicationData';
import type { PrimaryPublication } from '@lensshare/lens'
import { useAverageColor } from '@lensshare/web/src/hooks/useAverageColor'
import { getThumbnailUrl } from '@lensshare/web/src/hooks/getThumbnailUrl';
import { imageCdn } from '@lensshare/web/src/hooks/imageCdn';
import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

import TopOverlay from './TopOverlay'
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import { getPublicationMediaUrl } from '@lensshare/web/src/hooks/getPublicationMediaUrl';
import { PlayOutline } from './PlayOutline';
import { getShouldUploadVideo } from './getShouldUploadVideo';

type Props = {
  video: PrimaryPublication
}

const Video: FC<Props> = ({ video }) => {
  const { get } = useSearchParams()
  const [playerRef, setPlayerRef] = useState<HTMLMediaElement>()

  const isAutoPlay = Boolean(get('autoplay')) && get('autoplay') === '1'
  const isLoop = Boolean(get('loop')) && get('loop') === '1'
  const currentTime = Number(get('t') ?? 0) ?? 0

  const [clicked, setClicked] = useState(isAutoPlay || currentTime !== 0)

  const isBytesVideo = video.publishedOn?.id === APP_ID
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(video.metadata, true)),
    isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, isBytesVideo)

  const refCallback = (ref: HTMLMediaElement) => {
    if (!ref) {
      return null
    }
    setPlayerRef(ref)
  }

  useEffect(() => {
    if (playerRef && clicked) {
      playerRef.autoplay = true
      playerRef?.play().catch(() => {})
    }
  }, [playerRef, clicked, isAutoPlay])

  const onClickOverlay = () => {
    setClicked(true)
  }

  return (
    <div className="group relative h-screen w-screen overflow-x-hidden">
      {clicked ? (
        <VideoPlayer
          refCallback={refCallback}
          url={getPublicationMediaUrl(video.metadata)}
          posterUrl={thumbnailUrl}
          currentTime={currentTime}
          options={{
            autoPlay: isAutoPlay,
            muted: isAutoPlay,
            loop: isLoop,
            loadingSpinner: true,
            isCurrentlyShown: true,
            maxHeight: true
          }}
          shouldUpload={getShouldUploadVideo(video)}
        />
      ) : (
        <div className="flex h-full w-full justify-center">
          <img
            src={thumbnailUrl}
            className={clsx(
              'w-full bg-gray-100 object-center dark:bg-gray-900',
              isBytesVideo ? 'object-contain' : 'object-cover'
            )}
            style={{
              backgroundColor: backgroundColor && `${backgroundColor}95`
            }}
            alt="thumbnail"
            draggable={false}
          />
          <div
            className="absolute grid h-full w-full place-items-center"
            tabIndex={0}
            onClick={onClickOverlay}
            role="button"
          >
            <button className="bg-brand-700 rounded-full p-3 shadow-2xl xl:p-5">
              <PlayOutline className="size-6 pl-0.5 text-white" />
            </button>
          </div>
        </div>
      )}
      <TopOverlay playerRef={playerRef} video={video} />
    </div>
  )
}

export default Video
