import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import { Card } from '@lensshare/ui';
import Player from '@components/Shared/Audio/Player';
import { useRef, useState } from 'react';
import type { APITypes } from 'plyr-react';
import AudioPlayer from './AudioPlayer';
import { PrimaryPublication } from '@lensshare/lens';

const MiniPlayer = ({ audio }: { audio: PrimaryPublication }) => {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<APITypes>(null);

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
    <Card
      className="mt-3"
      forceRounded
      onClick={(event) => stopEventPropagation(event)}
    >
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
          </div>
        </div>
        <div className=" rounded-xl md:pb-3">
          <AudioPlayer audio={audio as PrimaryPublication}  />
        </div>
      </div>
    </Card>
  );
};
export default MiniPlayer;
