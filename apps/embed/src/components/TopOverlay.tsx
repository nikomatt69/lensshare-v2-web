
import {
  STATIC_ASSETS_URL,
  APP_NAME,
  BASE_URL
} from '@lensshare/data/constants'

import type { PrimaryPublication } from '@lensshare/lens'
import { CopyOutline } from '@lensshare/ui'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

type OverlayProps = {
  playerRef: HTMLMediaElement | undefined
  video: PrimaryPublication
}

const TopOverlay: FC<OverlayProps> = ({ playerRef, video }) => {
  const [showVideoOverlay, setShowVideoOverlay] = useState(true)
  const [copy] = useCopyToClipboard()

  useEffect(() => {
    if (playerRef) {
      playerRef.onpause = () => {
        setShowVideoOverlay(true)
      }
      playerRef.onplay = () => {
        setShowVideoOverlay(false)
      }
    }
  }, [playerRef])

  const onCopyVideoUrl = async () => {
    await copy(`${BASE_URL}/posts/${video.id}`)

  }

  return (
    <div
      className={`${
        showVideoOverlay ? 'visible' : 'invisible'
      } transition-all duration-200 ease-in-out group-hover:visible`}
    >
      <div className="absolute top-0 z-10 w-full text-white">
        <div className="flex items-center justify-between space-x-6 bg-gradient-to-b from-black/80 via-black/30 to-transparent p-3.5 pb-6">
          <div className="flex flex-1 items-center">
            <Link
              className="mr-3 flex-none cursor-pointer"
              href={`${BASE_URL}/u/${getProfile(video.by)?.slug}`}
              target="_blank"
           
            >
              <img
                src={getProfilePicture(video.by, 'AVATAR')}
                className="size-9 rounded-full"
                draggable={false}
                alt={getProfile(video.by)?.slug}
              />
            </Link>
            <div className="flex flex-col">
              <Link
                className="line-clamp-1 break-words leading-5"
                href={`${BASE_URL}/posts/${video?.id}`}
                target="_blank"
                
              >
                <h1 className="font-bold md:text-lg">
                  {getPublicationData(video.metadata)?.title}
                </h1>
              </Link>
              <Link
                className="line-clamp-1 break-words leading-3"
                href={`${BASE_URL}/u/${getProfile(video.by)?.slug}`}
                target="_blank"
               
              >
                <span className="text-sm">{getProfile(video.by)?.slug}</span>
              </Link>
            </div>
          </div>
          <button
            onClick={() => onCopyVideoUrl()}
            className="invisible rounded-full bg-black/50 p-3 transition-all duration-200 ease-in-out group-hover:visible"
          >
            <CopyOutline className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="absolute bottom-2 right-0 md:bottom-4">
        <Link
          className="flex items-center space-x-1.5 rounded-l-full bg-black/50 px-3 py-1.5 text-white"
          title={`Watch on ${APP_NAME}`}
          href={`${BASE_URL}/posts/${video?.id}`}
          target="_blank"
        
        >
          <img
            src={`${STATIC_ASSETS_URL}/brand/logo.svg`}
            draggable={false}
            className="ml-2 size-5 md:size-10"
            alt={APP_NAME}
            width={40}
          />
          <b>Watch on Tape</b>
        </Link>
      </div>
    </div>
  )
}

export default TopOverlay
