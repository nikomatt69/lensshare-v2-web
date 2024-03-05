import Link from 'next/link';
import type { FC } from 'react';
import React, { useRef, useState } from 'react';

import type WaveSurfer from 'wavesurfer.js';
import { Image } from '@lensshare/ui';
import { XCircleIcon } from '@heroicons/react/24/solid';
import useEchoStore from 'src/store/echos';
import { getThumbnailUrl } from 'src/hooks/getThumbnailUrl';
import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import { usePublicationQuery } from '@lensshare/lens';
import type { PrimaryPublication } from '@lensshare/lens';
import getPublicationData from '@lensshare/lib/getPublicationData';
import { useRouter } from 'next/router';
import type { APITypes } from 'plyr-react';
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import { imageCdn } from 'src/hooks/imageCdn';

type Props = {
  audio: PrimaryPublication;
};

const AudioPlayer: FC<Props> = ({ audio }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveSurfer = useRef<WaveSurfer>();

  const [volume, setVolume] = useState(0.5);
  const [currentPlayingTime, setCurrentPlayingTime] = useState('00:00');
  const { duration } = audio.metadata.content.duration;
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<APITypes>(null);
  const coverUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(audio?.metadata))
  );
  const metadata = getPublicationData(audio.metadata);

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

  const {
    query: { id }
  } = useRouter();
  const { data, error, loading } = usePublicationQuery({
    variables: {
      request: { forId: id }
    },
    skip: !id
  });

  return (
    <div className="flex h-20 w-full flex-row flex-wrap items-center gap-y-2 ">
      <div className="flex w-1/2 items-center">
        <div className="flex">
          <div className="h-16 w-16 flex-none">
            <Image
              src={getThumbnailUrl(audio.metadata)}
              width={500}
              height={500}
              className="h-full w-full"
              alt={audio.by.id}
            />
          </div>
          <div className="mx-4 flex flex-col justify-between text-black dark:text-white">
            <h5 className="line-clamp-1">{audio.metadata?.content}</h5>
            <Link
              href={`/u/${audio?.by?.handle}`}
              className="truncate text-[11px] font-medium uppercase text-black opacity-90 hover:underline dark:text-white"
            >
              {audio?.by?.handle?.localName}
            </Link>

            <div className="flex items-center text-xs">
              <div className="w-10 text-black dark:text-white">
                {currentPlayingTime}
              </div>
              <span className="pr-0.5">/</span>
              <div className="w-10 text-center text-black dark:text-white">
                {duration}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-black dark:text-white">
            <button
              onClick={handlePlayPause}
              className="mx-2 rounded-full  bg-blue-500 p-2 text-black outline-none dark:text-white"
            >
              {playing ? (
                <PauseIcon className="text-xl" />
              ) : (
                <PlayIcon className="pl-0.5 text-xl" />
              )}
            </button>
          </div>
          <div className="ml-2 flex items-center">
            <input
              type="range"
              step={10}
              value={volume * 100}
              
              className="hidden h-1 w-[100px] cursor-pointer appearance-none overflow-hidden rounded-lg bg-blue-700 lg:block xl:block"
            />
          </div>
          <div className=" r-0 mb-1" onClick={() => setSelectedTrack(null)}>
            <XCircleIcon className="h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center text-black dark:text-white">
        <div
          id="waveform"
          className=" w-full text-blue-700 "
          ref={waveformRef}
        />
        <div className="flex w-full items-center justify-between text-black dark:text-white">
          {/* <Reactions selectedTrack={selectedTrack} /> */}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
