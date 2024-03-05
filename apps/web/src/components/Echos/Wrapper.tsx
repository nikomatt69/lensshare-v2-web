import type { PrimaryPublication } from '@lensshare/lens';
import type { APITypes } from 'plyr-react';
import type { FC } from 'react';
import React, { useRef, useState } from 'react';
import useEchoStore from 'src/store/echos';
import { Image } from '@lensshare/ui';
import getAvatar from '@lensshare/lib/getAvatar';
import MiniPlayer from '@components/Shared/Audio/MiniPlayer';
import AudioMinimized from '@components/Shared/Audio/AudioMinimized';
import AudioPlayer from '@components/Shared/Audio/AudioPlayer';

type Props = {
  children: React.ReactNode;
 audio:PrimaryPublication
};

const Wrapper: FC<Props> = ({ children ,audio}) => {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<APITypes>(null);
  const selectedTrack = useEchoStore((state) => state.selectedTrack);

  return (
    <>
      {' '}
      <div className="xs:mb-22 sm:mb-22 display:absolute mx-auto mb-10 h-full max-w-[100rem] md:mb-10 lg:mb-10">
        {children}
        {playerRef.current && (
          <div className="z-999 xs:max-h-10 fixed bottom-14 left-0 right-0 z-[5] m-auto flex  items-center justify-around overflow-hidden rounded-lg  border-2 border-b-0 border-l border-r border-t border-blue-700 bg-white px-4 py-3 dark:bg-gray-800 lg:w-[1100px] xl:w-[1200px]">
            <div className="h-16 w-16 flex-none">
              <Image
                src={getAvatar(playerRef?.current?.plyr)}
                width={500}
                height={500}
                className="h-full w-full"
              />
            </div>
            <AudioPlayer audio={audio as PrimaryPublication} />
          </div>
        )}
      </div>
    </>
  );
};

export default Wrapper;
