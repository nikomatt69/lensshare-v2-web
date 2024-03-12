
import type { FC } from 'react';
import React from 'react';


import { AnyPublication, PrimaryPublication } from '@lensshare/lens';
import AudioPlayer from '@components/Shared/Audio/AudioPlayer';

type Props = {
  children: React.ReactNode;
  audio: PrimaryPublication;
};

const Wrapper: FC<Props> = ({ children,audio }) => {


  return (
    <>
      {' '}
      <div className="">
        {children}
        {audio && (
          <div className="z-999 xs:max-h-10 fixed bottom-14 left-0 right-0 z-[5] m-auto flex  items-center justify-around overflow-hidden rounded-lg  border-2 border-b-0 border-l border-r border-t border-blue-700 bg-white px-4 py-3 dark:bg-gray-800 lg:w-[1100px] xl:w-[1200px]">
            <AudioPlayer audio={audio} />
          </div>
        )}
      </div>
    </>
  );
};

export default Wrapper;
