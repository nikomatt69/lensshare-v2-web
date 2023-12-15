
import { PrimaryPublication } from '@lensshare/lens'
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl'
import type { FC } from 'react'
import React from 'react'
import { getThumbnailUrl } from 'src/hooks/getThumbnailUrl'
import { imageCdn } from 'src/hooks/imageCdn'
import { useAverageColor } from 'src/hooks/useAverageColor'

type Props = {
  children: React.ReactNode
  audio: PrimaryPublication
}

const Background: FC<Props> = ({ audio, children }) => {
  const coverUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(audio.metadata, true)),
    'SQUARE'
  )
  const { color: backgroundColor } = useAverageColor(coverUrl, true)

  return (
    <div style={{ backgroundColor }} className="relative h-1/4 overflow-hidden">
      <img
        src={coverUrl}
        className="absolute inset-0 w-full object-center"
        alt="audio cover"
        draggable={false}
      />
      <div className="absolute inset-0 h-full w-full bg-black bg-opacity-40" />
      <div className="backdrop-blur-3xl">{children}</div>
    </div>
  )
}

export default Background
