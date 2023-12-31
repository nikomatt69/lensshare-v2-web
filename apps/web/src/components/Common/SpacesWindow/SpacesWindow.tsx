/* eslint-disable @typescript-eslint/no-unused-vars */

import type { FC } from 'react';
import React, { useState } from 'react';
import { useAppStore } from 'src/store/app';

import SpaceWindowHeader from './SpaceWindowHeader';

import Meet from '@components/Meet/Meet';
import { DynamicIsland } from '@lensshare/ui';



const SpacesWindow: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <div className="fixed inset-0 bottom-20 top-auto z-[100] mx-auto flex h-fit w-full grow rounded-xl">
      <div className="relative mx-auto max-w-screen-xl grow rounded-xl">
        <div className="absolute bottom-0 right-0 ml-auto rounded-xl  border-[1.5px] border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex justify-center" />
          <SpaceWindowHeader
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
          <div className="min-w-[22rem]">
            {isExpanded ? <Meet /> : <DynamicIsland />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacesWindow;
