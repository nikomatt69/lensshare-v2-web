'use client'

import { LivepeerConfig } from '@livepeer/react'

import type { AnyPublication } from '@lensshare/lens'
import type { FC } from 'react'
import React, { useEffect } from 'react'

import Audio from './Audio'
import Video from './Video'

type Props = {
  publication: AnyPublication
}

const Publication: FC<Props> = ({ publication }) => {
  useEffect(() => {
    setFingerprint()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const target = getPublication(publication)
  const isAudio = isListenable(target)

  return (
    <div className={heyFont.className}>
      {isAudio ? (
        <Audio audio={target} />
      ) : (
        <LivepeerConfig client={getLivepeerClient()} theme={videoPlayerTheme}>
          <Video video={target} />
        </LivepeerConfig>
      )}
    </div>
  )
}

export default Publication
