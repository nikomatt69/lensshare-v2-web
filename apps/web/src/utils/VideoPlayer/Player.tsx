import { ARWEAVE_GATEWAY, IPFS_GATEWAY } from '@lensshare/data/constants'
import type { AspectRatio } from '@livepeer/react'
import { Player } from '@livepeer/react'

import type { FC } from 'react'
import React from 'react'

export interface PlayerProps {
  playerRef?: (ref: HTMLMediaElement) => void
  posterUrl?: string
  url?: string
  ratio?: AspectRatio
  showControls?: boolean
  address?: string
  options: {
    autoPlay?: boolean
    muted?: boolean
    loop?: boolean
    maxHeight?: boolean
    loadingSpinner: boolean
    isCurrentlyShown?: boolean
  },
  shouldUpload?: boolean
}

const PlayerInstance: FC<PlayerProps> = ({
  ratio,
  url,
  posterUrl,
  playerRef,
  options,
  address,
  showControls,
  shouldUpload
}) => {
  return (
    <Player
      src={url}
      poster={posterUrl}
      showTitle={false}
      objectFit="contain"
      aspectRatio={ratio}
      showPipButton
      viewerId={address}
      mediaElementRef={playerRef}
      loop={options.loop ?? true}
      showUploadingIndicator={false}
      muted={options?.muted ?? false}
      controls={{ defaultVolume: 1 }}
      autoPlay={options.autoPlay ?? false}
      showLoadingSpinner={options.loadingSpinner}
      _isCurrentlyShown={options.isCurrentlyShown ?? true}
      autoUrlUpload={
        shouldUpload
          ? {
              fallback: true,
              ipfsGateway: IPFS_GATEWAY,
              arweaveGateway: ARWEAVE_GATEWAY
            }
          : undefined
      }
      refetchPlaybackInfoInterval={1000 * 60 * 60 * 24 * 7} // to disable hls refetching every second
    >
      {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
      {!showControls ? <></> : null}
    </Player>
  )
}

export default React.memo(PlayerInstance)
