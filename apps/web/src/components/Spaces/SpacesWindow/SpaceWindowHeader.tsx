import { useEventListener, useHuddle01, useRoom } from '@huddle01/react/hooks';

import type { Dispatch, FC, SetStateAction } from 'react';
import React, { useEffect, useState } from 'react';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardDocumentIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

import toast from 'react-hot-toast';
import { Image } from '@lensshare/ui';
import Dropdown from '../Common/Dropdown';
import SettingsTray from '../Common/SettingsTray';
import { useSpacesStore } from 'src/store/persisted/spaces';
import type { Profile } from '@lensshare/lens';
import { useProfilesQuery } from '@lensshare/lens';
import { SpacesEvents } from 'src/enums';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import Slug from '@components/Shared/Slug';
import getAvatar from '@lensshare/lib/getAvatar';

interface SpacesWindowProps {
  isExpanded?: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}

const SpaceWindowHeader: FC<SpacesWindowProps> = ({
  isExpanded,
  setIsExpanded
}) => {
  const {
    space,
    setShowSpacesWindow,
    spacesPublicationId,
    activeSpeakerDevice,
    activeMicDevice,
    setActiveMicDevice,
    setActiveSpeakerDevice
  } = useSpacesStore();

  const { leaveRoom, endRoom } = useRoom();
  const { me } = useHuddle01();
  const [micDevices, setMicDevices] = useState<MediaDeviceInfo[]>([]);
  const [speakerDevices, setSpeakerDevices] = useState<MediaDeviceInfo[]>([]);

  const { data } = useProfilesQuery({
    variables: {
      request: { where: { ownedBy: [space.host] } }
    }
  });

  const hostProfile = data?.profiles?.items?.find(
    (profile) => profile?.ownedBy.address === space.host
  ) as Profile;

  useEventListener(SpacesEvents.ROOM_ME_LEFT, () => {
    setShowSpacesWindow(false);
  });

  useEffect(() => {
    if (!activeMicDevice || !activeSpeakerDevice) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
        navigator.mediaDevices.enumerateDevices().then(async (devices) => {
          const mic = devices.find((device) => device.kind === 'audioinput');
          if (mic && !activeMicDevice) {
            setActiveMicDevice(mic);
          }
          const speaker = devices.find(
            (device) => device.kind === 'audiooutput'
          );
          if (speaker && !activeSpeakerDevice) {
            setActiveSpeakerDevice(speaker);
          }
        });
      });
    }
    if (micDevices.length === 0 || speakerDevices.length === 0) {
      navigator.mediaDevices.enumerateDevices().then(async (devices) => {
        const mic = devices.filter((device) => device.kind === 'audioinput');
        setMicDevices(mic);
        const speaker = devices.filter(
          (device) => device.kind === 'audiooutput'
        );
        setSpeakerDevices(speaker);
      });
    }
  }, [
    activeMicDevice,
    activeSpeakerDevice,
    micDevices.length,
    setActiveMicDevice,
    setActiveSpeakerDevice,
    speakerDevices.length
  ]);

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
            <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
              {space.title}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ClipboardDocumentIcon
            className="h-5 w-5"
            onClick={async (event) => {
              stopEventPropagation(event);
              await navigator.clipboard.writeText(
                `${location.origin}/post/${spacesPublicationId}`
              );
              toast.success(`Copied to clipboard!`);
            }}
          />
          <Dropdown triggerChild={<EllipsisVerticalIcon className="h-5 w-5" />}>
            <div className="absolute top-4 z-10 -translate-x-12">
              <SettingsTray
                micDevices={micDevices}
                speakerDevices={speakerDevices}
              />
            </div>
          </Dropdown>

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

      {isExpanded && (
        <>
          <div className="my-1 text-base font-medium text-gray-900 dark:text-gray-200">
            {space.title}
          </div>
          <div className="flex items-center gap-1">
            <Image
              src={getAvatar(hostProfile)}
              className="h-4 w-4 rounded-full bg-violet-500"
            />
            <Slug
              slug={`@${hostProfile.handle?.localName}`}
              className="text-sm font-normal"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SpaceWindowHeader;
