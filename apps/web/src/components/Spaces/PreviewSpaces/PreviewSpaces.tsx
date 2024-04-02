
import {
  useAudio,
  useHuddle01,
  useLobby,
  useRoom,
  useVideo
} from '@huddle01/react/hooks';
import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from 'src/store/app';

import AvatarGrid from '../Common/AvatarGrid/AvatarGrid';
import SpacesButton from '../Common/SpacesButton';
import PreviewSpacesHeader from './PreviewSpacesHeader';
import { useUpdateEffect } from 'usehooks-ts';
import { useRouter } from 'next/router';
import { useSpacesStore } from 'src/store/persisted/spaces';
import { useTheme } from 'next-themes';
import type { HTMLAudioElementWithSetSinkId } from '../Common/SpacesTypes';
import { useMeetPersistStore } from 'src/store/meet';
import { useDisplayName } from '@huddle01/react/app-utils';
import SwitchDeviceMenu from '@components/Meet/SwitchDeviceMenu';
import cn from '@lensshare/ui/cn';
import { BasicIcons } from '@components/Meet/BasicIcons';

const PreviewSpaces: FC = () => {
  const { setShowSpacesLobby, setShowSpacesWindow } = useSpacesStore();
  const { space, lensAccessToken } = useSpacesStore();

  const { query, push } = useRouter();
  const { initialize, roomState } = useHuddle01();
  const { joinLobby, previewPeers, isLobbyJoined } = useLobby();

  const videoRef = useRef<HTMLVideoElement>(null);

  const { joinRoom } = useRoom();
  const { fetchVideoStream, stopVideoStream, stream: camStream } = useVideo();
  const { fetchAudioStream, stopAudioStream, stream: micStream } = useAudio();
  const { setDisplayName } = useDisplayName();
  const { currentProfile } = useAppStore();
  const [displayUserName, setDisplayUserName] = useState<string>(
    currentProfile?.handle?.localName ?? ''
  );
  const {
    toggleMicMuted,
    toggleCamOff,
    isMicMuted,
    isCamOff,
    videoDevice,
    audioInputDevice,
    audioOutputDevice
  } = useMeetPersistStore();

  const [audio] = useState(new Audio() as HTMLAudioElementWithSetSinkId);

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (query.roomid && '3kzet_ujpjtF8dzciFefEOAZqrDNpdQS') {
      initialize('3kzet_ujpjtF8dzciFefEOAZqrDNpdQS');
    }
  }, [initialize, query.roomid]);

  useEffect(() => {
    if (camStream && videoRef.current) {
      videoRef.current.srcObject = camStream;
    }
  }, [camStream]);

  addEventListener('app:cam-on', async () => {
    console.log('On');
    toggleCamOff(false);
  });

  addEventListener('app:cam-off', async () => {
    console.log('off');
    toggleCamOff(true);
  });

  addEventListener('app:mic-on', async () => {
    toggleMicMuted(false);
  });

  addEventListener('app:mic-off', async () => {
    toggleMicMuted(true);
  });

  useEffect(() => {
    if (displayUserName) {
      setDisplayName(displayUserName);
    }
  }, [displayUserName, setDisplayName]);

  useEffect(() => {
    joinLobby(query.roomid as string);
  }, [joinLobby, query.roomid]);

  useUpdateEffect(() => {
    if (!isCamOff) {
      stopVideoStream();
      fetchVideoStream(videoDevice.deviceId);
    }
  }, [videoDevice]);

  useUpdateEffect(() => {
    if (!isMicMuted) {
      stopAudioStream();
      fetchAudioStream(audioInputDevice.deviceId);
    }
  }, [audioInputDevice]);

  useUpdateEffect(() => {
    audio.setSinkId(audioOutputDevice.deviceId);
  }, [audioOutputDevice]);

  addEventListener('room:joined', () => {
    push(`/spaces/${query.roomid}`);
  });

  return (
    <div className="fixed inset-0 z-[10000] grid place-items-center bg-gray-900/80 text-center">
      <div className=" rounded-lg bg-gray-100 dark:bg-black">
        <PreviewSpacesHeader />
        <AvatarGrid isLobbyPreview={previewPeers.length ? true : false} />
        <div className="border-t border-gray-300 py-4 text-center text-sm text-gray-500 dark:border-gray-800">
          Your mic will be off at the start
        </div>
        <div
          className={cn(
            'flex items-center justify-center self-stretch rounded-lg p-2'
          )}
        >
          <div className="flex w-full flex-row items-center justify-center gap-8">
            {!camStream ? (
              <button
                onClick={() => {
                  fetchVideoStream(videoDevice.deviceId);
                }}
                className="bg-brand-500 flex h-10 w-10 items-center justify-center rounded-xl"
              >
                {BasicIcons.inactive['cam']}
              </button>
            ) : (
              <button
                onClick={stopVideoStream}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl'
                )}
              >
                {BasicIcons.active['cam']}
              </button>
            )}
            {!micStream ? (
              <button
                onClick={() => {
                  fetchAudioStream(audioInputDevice.deviceId);
                }}
                className="bg-brand-500 flex h-10 w-10 items-center justify-center rounded-xl"
              >
                {BasicIcons.inactive['mic']}
              </button>
            ) : (
              <button
                onClick={() => {
                  stopAudioStream();
                }}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl'
                )}
              >
                {BasicIcons.active['mic']}
              </button>
            )}
            <SwitchDeviceMenu />
          </div>
        </div>
        <div className="flex w-full items-center">
          <div className="flex w-full flex-col justify-center gap-1">
            <div className="flex w-full flex-col justify-center gap-1">
              Allow Mic and Cam
            </div>

            <div
              className={cn(
                resolvedTheme == 'dark' ? 'text-blue-700 ' : 'text-blue-700 ',
                'flex w-full items-center justify-center gap-2 rounded-[10px]  backdrop-blur-[400px]'
              )}
            >
              <input
                type="text"
                placeholder="Set Usernsme"
                className=" max-w-xs  items-center rounded-lg  bg-transparent text-blue-700 outline-none "
                value={displayUserName}
                onChange={(e) => setDisplayUserName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="pb-3">
          <SpacesButton
            onClick={async () => {
              if (isLobbyJoined) {
                joinRoom();
              }
            }}
          >
            {currentProfile?.ownedBy.address === space.host
              ? 'Start spaces'
              : 'Start listening'}
          </SpacesButton>
        </div>
      </div>
    </div>
  );
};

export default PreviewSpaces;
