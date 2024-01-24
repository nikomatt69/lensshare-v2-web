import type { PrimaryPublication } from '@lensshare/lens';
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import type { FC } from 'react';
import React from 'react';
import { imageCdn } from 'src/hooks/imageCdn';
import { useAverageColor } from 'src/hooks/useAverageColor';
import getVideoCoverUrl from '@lensshare/lib/getVideoCoverUrl';
import { Image } from '@lensshare/ui';
import { getThumbnailUrl } from 'src/hooks/getThumbnailUrl';
type Props = {
  children: React.ReactNode;
  audio: PrimaryPublication;
};

const Background: FC<Props> = ({ audio, children }) => {
  const coverUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(audio?.metadata))
  );
  const { color: backgroundColor } = useAverageColor(coverUrl, true);

  return (
    <div
      style={{ backgroundColor }}
      className="relative h-1/4 overflow-hidden rounded-3xl "
    >
      <Image
        src={coverUrl}
        className="absolute inset-0 w-full object-center"
        alt="audio cover"
        draggable={false}
      />
      <div className="absolute inset-0 h-full w-full bg-black bg-opacity-40 pb-4" />
      <div className="pb-4 backdrop-blur-3xl">{children}</div>
    </div>
  );
};

export default Background;
