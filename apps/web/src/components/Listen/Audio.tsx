import type { PrimaryPublication } from '@lensshare/lens';
import { getPublicationData } from 'src/hooks/getPublicationData';
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';

import type { FC } from 'react';
import React, { useRef, useState } from 'react';

import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import { getThumbnailUrl } from 'src/hooks/getThumbnailUrl';
import { imageCdn } from 'src/hooks/imageCdn';
import Player from '@components/Shared/Audio/Player';
import type { APITypes } from 'plyr-react';
import UserProfile from '@components/Shared/UserProfile';
import useEchoStore from 'src/store/echos';
import PublicationActions from '@components/Publication/Actions';
import { Image } from '@lensshare/ui';

type Props = {
  audio: PrimaryPublication;
};

const Audio: FC<Props> = ({ audio }) => {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<APITypes>(null);
  const coverUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(audio.metadata))
  );
  const metadata = getPublicationData(audio.metadata);
  const duration = metadata?.asset?.duration;
  const setSelectedTrack = useEchoStore((state) => state.setSelectedTrack);

  const handlePlayPause = () => {
    if (!playerRef.current) {
      return;
    }
    if (playerRef.current?.plyr.paused && !playing) {
      setPlaying(true);

      return playerRef.current?.plyr.play();
    }
    setPlaying(false);
    playerRef.current?.plyr.pause();
  };

  return (
    <div>
      <div className="mx-auto grid place-items-center gap-6 py-10 md:grid-cols-2">
        <div className="relative flex aspect-[1/1] w-[250px] justify-center md:w-[350px]">
          <Image
            src={coverUrl}
            className="tape-border h-full w-full rounded-xl object-cover"
            alt="audio cover"
            height={500}
            width={500}
            draggable={false}
          />
          <div className="absolute inset-0 flex items-end justify-end space-x-1 p-3" />
        </div>
        <div className="flex w-full flex-col items-center space-y-4 text-white lg:items-start">
          <h1 className="line-clamp-1 text-xl font-bold leading-normal text-white">
            {metadata?.title}
          </h1>
          <button type="button" onClick={handlePlayPause}>
            {playing && !playerRef.current?.plyr.paused ? (
              <PauseIcon className="h-[50px] w-[50px] text-gray-100 hover:text-white" />
            ) : (
              <PlayIcon className="h-[50px] w-[50px] text-gray-100 hover:text-white" />
            )}
          </button>
        </div>
      </div>
      <div className="pb-4">
        <Player
          playerRef={playerRef}
          src={getPublicationData(audio.metadata)?.asset?.uri ?? ''}
        />
      </div>
      <div className="m-4 ml-5 justify-center">
        <PublicationActions publication={audio} />
      </div>

      <h1 className="laptop:text-2xl bg-trasparent mb-3 ml-4 text-xl font-bold">
        Artist
      </h1>
      <div className="center-items bg-trasparent ml-4 mt-2 ">
        <UserProfile profile={audio.by} />
      </div>
    </div>
  );
};

export default Audio;
