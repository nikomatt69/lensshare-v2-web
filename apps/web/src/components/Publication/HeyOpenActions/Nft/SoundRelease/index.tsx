import type { SoundReleaseMetadata } from '@lensshare/types/nft';
import type { APITypes } from 'plyr-react';

import Player from '@components/Shared/Audio/Player';
import {
  CursorArrowRaysIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/react/24/solid';
import { REWARDS_ADDRESS, STATIC_ASSETS_URL } from '@lensshare/data/constants';
import humanize from '@lensshare/lib/humanize';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import { Button, Card, Image, Tooltip } from '@lensshare/ui';
import Link from 'next/link';
import { type FC, useRef, useState } from 'react';
import useSoundRelease from 'src/hooks/sound/useSoundRelease';
import urlcat from 'urlcat';

import NftShimmer from './Shimmer';
import type { AnyPublication } from '@lensshare/lens';

interface SoundReleaseProps {
  nftMetadata: SoundReleaseMetadata;
  publication: AnyPublication;
}

const SoundRelease: FC<SoundReleaseProps> = ({ nftMetadata, publication }) => {
  const { handle, mintLink, slug } = nftMetadata;
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<APITypes>(null);

  const {
    data: release,
    error,
    loading
  } = useSoundRelease({
    enabled: Boolean(handle && slug),
    handle,
    slug
  });

  if (loading) {
    return <NftShimmer />;
  }

  if (!release) {
    return null;
  }

  if (error) {
    return null;
  }

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

  const { artist, coverImage, numSold, title, track } = release;
  const peaks = track.normalizedPeaks?.reduce(
    (acc: number[], curr: number, index) => {
      if (index % 10 === 0) {
        acc.push(curr / 2);
      }

      return acc;
    },
    []
  );

  return (
    <Card
      className="mt-3"
      forceRounded
      onClick={(event) => stopEventPropagation(event)}
    >
      <div
        className="rounded-t-xl  dark:border-gray-700"
        onClick={stopEventPropagation}
        style={{
          backgroundColor: coverImage.dominantColor,
          backgroundImage: `url(${coverImage.url})`
        }}
      >
        <div className="!rounded-t-xl  backdrop-blur-2xl backdrop-brightness-50">
          <div className="flex justify-center p-5">
            <Image
              alt={`sound-release-cover-${coverImage.url}`}
              className="h-30 w-30 rounded-xl object-cover"
              draggable={false}
              height={160}
              src={coverImage.url}
              width={160}
            />
          </div>
          <div className="m-1 flex w-[full] flex-col justify-between truncate rounded-xl bg-gray-500/90 px-3">
            <div className=" mt-3 flex-col justify-between md:mt-7">
              <div className="flex w-full items-center space-x-2.5 truncate rounded-xl">
                <button onClick={handlePlayPause} type="button">
                  {playing && !playerRef.current?.plyr.paused ? (
                    <PauseIcon className=" h-[40] w-[40px] rounded-3xl text-gray-100 hover:text-white" />
                  ) : (
                    <PlayIcon className=" h-[40] w-[40px] rounded-3xl text-gray-100 hover:text-white" />
                  )}
                </button>
                <div className="w-full space-y-1 truncate pr-3">
                  <h5 className=" truncate rounded-3xl text-md text-white">
                    {title}
                  </h5>
                  <h6 className="flex items-center space-x-2 truncate  text-white/70">
                    <img
                      alt="Artist"
                      className="h-4 w-4 rounded-full"
                      height={16}
                      src={artist.user.avatar.url}
                      width={16}
                    />
                    <div className="  rounded-3xl text-gray-100 hover:text-white">
                      {artist.name}
                    </div>
                    
                  </h6>
                  <b className=" rounded-3xl text-sm">
                      {humanize(numSold)} Mints
                    </b>
                </div>
              </div>
            </div>
            <div className=" rounded-xl md:pb-3">
              <Player playerRef={playerRef} src={track.audio.audio256k.url} />
            </div>
          </div>
          <div className="flex items-end space-x-1">
            {peaks?.map((peak, index) => (
              <div
                className="w-2 rounded-t-lg bg-gray-100/50"
                key={`peak-${index}`}
                style={{
                  height: `${peak}px`
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-700">
        <div className="mr-5 flex flex-wrap items-center gap-2">
          <Tooltip content="Sound Release" placement="right">
            <img
              className="h-5 w-5 rounded-full"
              src={`${STATIC_ASSETS_URL}/images/sound.png`}
            />
          </Tooltip>
          <div className="text-sm font-bold">{title}</div>
        </div>
        <Link
          href={urlcat(mintLink, {
            referral: REWARDS_ADDRESS,
            referral_source: 'link'
          })}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Button
            className="text-sm"
            icon={<CursorArrowRaysIcon className="h-4 w-4" />}
            size="md"
          >
            Open
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default SoundRelease;
