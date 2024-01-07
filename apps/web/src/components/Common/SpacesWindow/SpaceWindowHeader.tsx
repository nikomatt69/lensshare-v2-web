import { useHuddle01, useRoom } from '@huddle01/react/hooks';

import type { Dispatch, FC, SetStateAction } from 'react';
import React, { useState } from 'react';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

import toast from 'react-hot-toast';

import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import imageKit from '@lensshare/lib/imageKit';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';

interface SpacesWindowProps {
  isExpanded?: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}

const SpaceWindowHeader: FC<SpacesWindowProps> = ({
  isExpanded,
  setIsExpanded
}) => {
  const { leaveRoom, endRoom } = useRoom();
  const { me } = useHuddle01();
  const [micDevices, setMicDevices] = useState<MediaDeviceInfo[]>([]);
  const [speakerDevices, setSpeakerDevices] = useState<MediaDeviceInfo[]>([]);

  return (
    <div className="border-b border-gray-300 pb-3 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDownIcon
              className="h-5 w-5"
              onClick={() => setIsExpanded((prev) => !prev)}
            />
          ) : (
            <ChevronUpIcon
              className="h-5 w-5"
              onClick={() => setIsExpanded((prev) => !prev)}
            />
          )}
          {!isExpanded && (
            <div className="my-auto flex text-sm font-medium text-gray-900 dark:text-gray-300">
              <img
                src={imageKit(`${STATIC_ASSETS_URL}/images/icon.png`)}
                draggable={false}
                className="h-8 w-8 md:h-16 md:w-16"
                alt="lensshare"
              />{' '}
              <p className="my-auto">Space</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ClipboardDocumentIcon
            className="h-5 w-5"
            onClick={async (event) => {
              stopEventPropagation(event);
              await navigator.clipboard.writeText(`${location}`);
              toast.success(`Copied to clipboard!`);
            }}
          />

          {isExpanded &&
            (me.role === 'host' ? (
              <button className="text-brand-500 text-sm" onClick={endRoom}>
                End Spaces
              </button>
            ) : (
              <button className="text-brand-500 text-sm" onClick={leaveRoom}>
                Leave room
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SpaceWindowHeader;
