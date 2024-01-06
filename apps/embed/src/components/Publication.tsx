'use client'

import { LivepeerConfig, createReactClient } from '@livepeer/react'

import type { AnyPublication } from '@lensshare/lens'
import type { FC } from 'react'
import React, { useEffect } from 'react'

import Audio from './Audio'
import Video from './Video'
import { getPublication } from './getPublication'
import { isListenable } from './isListenable'
import { setFingerprint } from './fingerprint'
import {  videoPlayerTheme } from './livepeer'
import { studioProvider } from '@livepeer/react'

type Props = {
  publication: AnyPublication
}

const Publication: FC<Props> = ({ publication }) => {
  useEffect(() => {
    setFingerprint()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const target = getPublication(publication)
  const getLivepeerClient = () => {
    return createReactClient({
      provider: studioProvider({
        apiKey: '30c0057f-d721-414e-8e03-7ff98f407535'
      })
    })
  }

  return (
    <div >
     
        <LivepeerConfig client={getLivepeerClient()} theme={videoPlayerTheme}>
          <Video video={target} />
        </LivepeerConfig>
   
    </div>
  )
}

export default Publication
