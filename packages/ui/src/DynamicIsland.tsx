import * as React from 'react';

import { useTheme } from 'next-themes';
import { useAudio, useHuddle01, usePeers } from '@huddle01/react/hooks';
import { useState } from 'react';
import Link from 'next/link';
export const DynamicIsland = (): JSX.Element => {
  const [meetingUrl, setMeetingUrl] = useState('');
  const { peers } = usePeers();
  const { me } = useHuddle01();
  const { resolvedTheme } = useTheme();
  const {
    produceAudio,
    stopProducingAudio,
    stream: micStream,
    fetchAudioStream,
    stopAudioStream
  } = useAudio();

  const currentUrl = window.location.href;
  React.useEffect(() => {
    setMeetingUrl(currentUrl);
  }, [meetingUrl]);
  return (
    <div className="h-max-15 max-w-100 relative top-3 left-auto z-[100] mx-auto flex items-stretch justify-center gap-5 overflow-auto rounded-3xl bg-black/80 p-4 shadow-2xl">
      <div className="h-max-15 flex items-stretch  justify-between gap-2">
        <div className="mt-1flex grow basis-[0%] flex-col items-stretch self-start">
          <div className="text-sm leading-5 text-neutral-500">CurrentCall</div>

          <div className="mt-0.5 whitespace-nowrap text-xs leading-5 text-white">
            <Link href={meetingUrl}>{meetingUrl}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
