import MetaTags from '@components/Common/MetaTags';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useDisplayName } from '@huddle01/react/app-utils';
import {
  useAudio,
  useHuddle01,
  useLobby,
  useRoom,
  useVideo
} from '@huddle01/react/hooks';
import { APP_NAME, STATIC_ASSETS_URL } from '@lensshare/data/constants';
import cn from '@lensshare/ui/cn';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { useMeetPersistStore } from 'src/store/meet';
import { useAppStore } from 'src/store/useAppStore';
import { useUpdateEffect } from 'usehooks-ts';

import { BasicIcons } from '../BasicIcons';
import SwitchDeviceMenu from '../SwitchDeviceMenu';

type HTMLAudioElementWithSetSinkId = HTMLAudioElement & {
  setSinkId: (id: string) => void;
};

const Lobby: NextPage = () => {
  const { query, push } = useRouter();
  const { initialize } = useHuddle01();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { joinLobby, isLobbyJoined } = useLobby();
  const { joinRoom } = useRoom();
  const { fetchVideoStream, stopVideoStream, stream: camStream } = useVideo();
  const { fetchAudioStream, stopAudioStream, stream: micStream } = useAudio();
  const { setDisplayName } = useDisplayName();
  const currentProfile = useAppStore((state) => state.currentProfile);
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
  }, [query.roomid]);

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
  }, [displayUserName]);

  useEffect(() => {
    joinLobby(query.roomid as string);
  }, []);

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
    push(`/meet/${query.roomid}`);
  });

  return (
    <main className="bg-lobby flex h-screen flex-col items-center justify-center">
      <MetaTags title={`${APP_NAME} Meet`} />
      <div className="flex h-[35vh] w-[35vw] flex-col items-center justify-center gap-4">
        <div
          className={cn(
            resolvedTheme == 'dark' ? 'bg-gray-900' : 'bg-brand-100',
            'relative mx-auto flex w-fit items-center justify-center rounded-lg text-center'
          )}
        >
          <div className="flex h-[36vh] w-[44vw] items-center justify-center rounded-lg ">
            {camStream ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="min-h-full min-w-full self-stretch rounded-lg object-cover"
              />
            ) : (
              <img
                src={`${STATIC_ASSETS_URL}/images/default-avatar.svg`}
                alt="avatar"
                className="mb-16 mt-16 h-24 w-24"
              />
            )}
          </div>
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
        <div className="flex w-full items-center">
          <button
            className="bg- bg-brand-500 mt-2 flex w-full items-center justify-center rounded-md p-2 text-blue-700 "
            onClick={async () => {
              if (isLobbyJoined) {
                joinRoom();
              }
            }}
          >
            Start Meeting
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default Lobby;
