/* eslint-disable react-hooks/exhaustive-deps */
import {
  useAudio,
  useEventListener,
  useHuddle01,
  usePeers,
  useRoom,
  useVideo
} from '@huddle01/react/hooks';
import cn from '@lensshare/ui/cn';
import { useTheme } from 'next-themes';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useUpdateEffect } from 'usehooks-ts';

import AudioElem from './Audio';
import { BasicIcons } from './BasicIcons';
import SwitchDeviceMenu from './SwitchDeviceMenu';
import VideoElem from './Video';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import { useAppStore } from 'src/store/persisted/useAppStore';
import { useMeetPersistStore } from 'src/store/persisted/meet';

type HTMLAudioElementWithSetSinkId = HTMLAudioElement & {
  setSinkId: (id: string) => void;
};

const Meet: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { currentProfile } = useAppStore();
  const { leaveRoom } = useRoom();
  const {
    produceAudio,
    stopProducingAudio,
    stream: micStream,
    fetchAudioStream,
    stopAudioStream
  } = useAudio();
  const {
    produceVideo,
    stopProducingVideo,
    stream: camStream,
    fetchVideoStream,
    stopVideoStream
  } = useVideo();
  const {
    isMicMuted,
    isCamOff,
    toggleMicMuted,
    toggleCamOff,
    videoDevice,
    audioInputDevice,
    audioOutputDevice
  } = useMeetPersistStore();
  const { peers } = usePeers();
  const { me } = useHuddle01();
  const { resolvedTheme } = useTheme();
  const [show, setShow] = useState(true);
  const [audio] = useState(new Audio() as HTMLAudioElementWithSetSinkId);

  addEventListener('app:cam-on', async () => {
    toggleCamOff(false);
    produceVideo(camStream);
  });

  useEventListener('app:cam-off', async () => {
    toggleCamOff(true);
    stopProducingVideo();
  });

  useEventListener('app:mic-on', async () => {
    toggleMicMuted(false);
    if (micStream) {
      produceAudio(micStream);
    }
  });

  useEventListener('app:mic-off', async () => {
    toggleMicMuted(true);
    stopProducingAudio();
  });

  useEffect(() => {
    if (camStream && videoRef.current) {
      videoRef.current.srcObject = camStream;
      produceVideo(camStream);
    }
  }, [camStream]);

  useEffect(() => {
    console.log('isCamOff', isCamOff);
    if (!isCamOff) {
      fetchVideoStream(videoDevice.deviceId);
    }
  }, [isCamOff]);

  useEffect(() => {
    console.log('isCamOff', isCamOff);
    if (!isMicMuted) {
      fetchAudioStream(audioInputDevice.deviceId);
    }
  }, [isMicMuted]);

  useEffect(() => {
    if (micStream) {
      toggleMicMuted(false);
      produceAudio(micStream);
    }
  }, [micStream]);

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

  const handleClick = () => {
    setShow(false);
  };

  return (
    <div className=" my-10 h-[50vh] flex-col items-center justify-center self-stretch overflow-scroll xl:h-[80vh]">
      <div className="flex h-full grid-cols-2 items-center justify-center gap-10 rounded-lg">
        <div
          className={cn(
            Object.values(peers).length === 0
              ? 'my-10 h-[16vh] w-[16vw]'
              : 'h-[50vh] w-[36vw]',
            resolvedTheme == 'dark' ? 'bg-gray-900' : 'bg-white-100',
            'relative mt-2 flex flex-shrink-0 items-center justify-center rounded-xl '
          )}
        >
          {!isCamOff ? (
            <video
              ref={videoRef}
              autoPlay
              disablePictureInPicture
              disableRemotePlayback
              playsInline
              muted
              className="h-[60vh] w-full rounded-lg object-cover"
              style={{ transform: 'rotateY(180deg)' }}
            />
          ) : (
            <img
              src={`${STATIC_ASSETS_URL}/images/default-avatar.svg`}
              alt="avatar"
              className="mb-16 mt-16  h-32 w-32"
            />
          )}
          <div
            className={cn(
              resolvedTheme == 'dark'
                ? 'bg-gray-900 text-blue-700 '
                : 'bg-brand-100 text-blue-700',
              'xs:hidden absolute  bottom-1 left-1 rounded-lg p-1 sm:hidden'
            )}
          >
            {me.displayName ?? 'Me'}
          </div>
        </div>

        {Object.values(peers).map(({ cam, peerId, mic, displayName }) => (
          <div
            key={peerId}
            className={cn(
              resolvedTheme == 'dark' ? 'bg-gray-900' : 'bg-brand-100',
              'relative flex h-[40vh] w-[38vw] flex-shrink-0 items-center justify-center rounded-lg'
            )}
          >
            {cam ? (
              <VideoElem track={cam} key={peerId} />
            ) : (
              <img
                key={peerId}
                src={`${STATIC_ASSETS_URL}/images/default-avatar.svg`}
                alt="avatar"
                className="mb-16 mt-16 h-32 w-32"
              />
            )}
            {mic && <AudioElem track={mic} key={peerId} />}
            <div
              className={cn(
                resolvedTheme == 'dark'
                  ? 'bg-blue-700  text-slate-100'
                  : 'text-brand-500 bg-brand-100',
                'absolute bottom-1 left-1 rounded-lg p-1'
              )}
            >
              {displayName ?? 'Me'}
            </div>
          </div>
        ))}
      </div>
      <div className="z-[1000] flex items-center justify-center self-stretch pt-2">
        <div className="z-[1000] flex w-full flex-row items-center justify-center gap-8">
          {isCamOff ? (
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
                resolvedTheme == 'dark' ? 'bg-gray-900' : 'bg-brand-100',
                'flex h-10 w-10 items-center justify-center rounded-xl'
              )}
            >
              {BasicIcons.active['cam']}
            </button>
          )}
          {isMicMuted ? (
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
              onClick={stopAudioStream}
              className={cn(
                resolvedTheme == 'dark' ? 'bg-gray-900' : 'bg-brand-100',
                'flex h-10 w-10 items-center justify-center rounded-xl'
              )}
            >
              {BasicIcons.active['mic']}
            </button>
          )}
          <button
            onClick={() => {
              leaveRoom();
              window.close();
            }}
            className="bg-brand-500 flex h-10 w-10 items-center justify-center rounded-xl"
          >
            {BasicIcons.close}
          </button>
          <SwitchDeviceMenu />
        </div>
      </div>
    </div>
  );
};

export default Meet;
