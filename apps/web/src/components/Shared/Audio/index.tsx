import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';
import type { AnyPublication, Profile } from '@lensshare/lens';
import getProfile from '@lensshare/lib/getProfile';
import type { APITypes } from 'plyr-react';
import type { ChangeEvent, FC } from 'react';
import { useRef, useState } from 'react';
import { usePublicationStore } from 'src/store/usePublicationStore';
import { object, string } from 'zod';

import CoverImage from './CoverImage';
import Player from './Player';
import { Card } from '@lensshare/ui';
import { useAverageColor } from 'src/hooks/useAverageColor';
import ListenModal from '@components/Listen/SpacesWindow/ListenModal';

export const AudioPublicationSchema = object({
  title: string().trim().min(1, { message: 'Invalid audio title' }),
  artist: string().trim().min(1, { message: 'Invalid artist name' }),
  cover: string().trim().min(1, { message: 'Invalid cover image' })
});

interface AudioProps {
  src: string;
  poster: string;
  artist?: string;
  title?: string;
  isNew?: boolean;
  publication?: AnyPublication;
  expandCover: (url: string) => void;
}

const Audio: FC<AudioProps> = ({
  src,
  poster,
  artist,
  title,
  isNew = false,
  publication,
  expandCover
}) => {
  const [newPreviewUri, setNewPreviewUri] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const { audioPublication, setAudioPublication } = usePublicationStore();
  const playerRef = useRef<APITypes>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAudioPublication({
      ...audioPublication,
      [e.target.name]: e.target.value
    });
  };
  const { color: backgroundColor } = useAverageColor(poster, true);

  return (
    <Card className="divide-y-[1px] bg-black bg-opacity-40 dark:divide-gray-700">
      <div
        style={{ backgroundColor }}
        className="flex flex-wrap rounded-xl bg-black bg-opacity-40 pb-4 md:flex-nowrap md:space-x-2"
      >
        <div className="rounded-xl">
          <CoverImage
            isNew={isNew}
            cover={isNew ? (newPreviewUri as string) : poster}
            setCover={(previewUri, url) => {
              setNewPreviewUri(previewUri);
              setAudioPublication({ ...audioPublication, cover: url });
            }}
            imageRef={imageRef}
            expandCover={expandCover}
          />
        </div>
        <div className=" flex flex-col justify-between truncate py-1 md:px-3">
          <div className="mt-3 flex justify-between md:mt-7">
            <div className="flex w-full items-center space-x-2.5 truncate">
              <button type="button" onClick={handlePlayPause}>
                {playing && !playerRef.current?.plyr.paused ? (
                  <PauseIcon className="h-[50px] w-[50px] hover:text-white dark:text-gray-100" />
                ) : (
                  <PlayIcon className="h-[50px] w-[50px] hover:text-white dark:text-gray-100" />
                )}
              </button>
              <div className="w-full truncate pr-3">
                {isNew ? (
                  <div className="flex w-full flex-col space-y-1">
                    <input
                      className="border-none bg-transparent p-0 text-lg placeholder:text-white focus:ring-0 dark:text-white"
                      placeholder="Add title"
                      name="title"
                      value={audioPublication.title}
                      autoComplete="off"
                      onChange={handleChange}
                    />
                    <input
                      className="border-none bg-transparent p-0 placeholder:text-white/70 focus:ring-0 dark:text-white/70"
                      placeholder="Add artist"
                      name="artist"
                      value={audioPublication.artist}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                ) : (
                  <>
                    <h5 className="truncate text-lg dark:text-white">
                      {title}
                    </h5>
                    <h6 className="truncate dark:text-white/70">
                      {artist ??
                        getProfile(publication?.by as Profile).displayName}
                    </h6>
                    <ListenModal publication={publication?.id} />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="md:pb-3">
            <Player src={src} playerRef={playerRef} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Audio;
