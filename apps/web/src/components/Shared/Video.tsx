import 'plyr-react/plyr.css';

import { ARWEAVE_GATEWAY, IPFS_GATEWAY } from '@lensshare/data/constants';
import imageKit from '@lensshare/lib/imageKit';
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import cn from '@lensshare/ui/cn';
import { Player } from '@livepeer/react';
import type { FC } from 'react';
import { memo } from 'react';
import { useAppStore } from 'src/store/persisted/useAppStore';

interface VideoProps {
  src: string;
  poster?: string;
  className?: string;
}

const Video: FC<VideoProps> = ({ src, poster, className = '' }) => {
  const { currentProfile } = useAppStore();

  return (
    <div className={cn('lp-player', className)} onClick={stopEventPropagation}>
      <Player
        src={src}
        poster={imageKit(sanitizeDStorageUrl(poster))}
        objectFit="contain"
        showLoadingSpinner
        showUploadingIndicator
        showPipButton={false}
        viewerId={currentProfile?.ownedBy.address}
        controls={{ defaultVolume: 1 }}
        refetchPlaybackInfoInterval={1000 * 60 * 60 * 24}
        playRecording
        autoUrlUpload={{
          fallback: true,
          ipfsGateway: IPFS_GATEWAY,
          arweaveGateway: ARWEAVE_GATEWAY
        }}
      />
    </div>
  );
};

export default memo(Video);
