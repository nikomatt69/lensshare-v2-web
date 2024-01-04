import clsx from 'clsx';

import React, { useEffect, useRef, useState } from 'react';
import { Image } from '@lensshare/ui';
import type { Profile } from '@lensshare/lens';
import getAvatar from '@lensshare/lib/getAvatar';
import useFetchLensProfiles from './useFetchLensProfiles';

type VideoPropsType = {
  isVideoOn: boolean | null;
  stream: any;
  profile: string;
  isMuted?: boolean;
  isMainFrame?: boolean;
  videoFramestyles?: string;
};

const Video = ({
  isVideoOn,
  stream,
  profile,
  isMuted = true,
  isMainFrame,
  videoFramestyles
}: VideoPropsType) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lensProfile, setLensProfile] = useState<Profile>();
  const { getLensProfile } = useFetchLensProfiles();

  useEffect(() => {
    if (!profile) {
      return;
    }
    (async function () {
      const profileResponse = await getLensProfile(profile);
      if (profileResponse) {
        setLensProfile(profileResponse);
      }
    })();
  }, [getLensProfile, profile]);

  useEffect(() => {
    if (isVideoOn && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream, videoRef, isVideoOn]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="relative mx-auto w-full">
        {isVideoOn ? (
          <div className="flex items-center justify-center">
            <video
              id="localVideo"
              className={videoFramestyles}
              ref={videoRef}
              autoPlay
              muted={isMuted}
            />
          </div>
        ) : (
          <div
            className={clsx(
              isMainFrame
                ? 'mx-auto flex h-[87vh] w-[100%] rounded-2xl bg-[#F4F4F5] dark:bg-gray-700 sm:h-[57vh] sm:w-[95%] md:h-[65] md:w-[95%]'
                : 'flex h-[120px] w-[198px] rounded-2xl bg-gray-200 dark:bg-gray-600 sm:h-[143px] sm:w-[254px] md:h-[171px] md:w-[302px]'
            )}
          >
            <Image
              onError={(
                event: React.SyntheticEvent<HTMLImageElement, Event>
              ) => {
                event.currentTarget.src = getAvatar(lensProfile);
              }}
              src={getAvatar(lensProfile)}
              loading="lazy"
              className="m-auto h-24 w-24 rounded-full border bg-gray-200 dark:border-gray-700"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;
