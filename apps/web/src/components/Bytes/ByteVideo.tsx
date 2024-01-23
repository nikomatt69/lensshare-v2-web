import MetaTags from '@components/Common/MetaTags';

import type { FC } from 'react';
import React, { useEffect, useRef } from 'react';

import TopOverlay from './TopOverlay';
import { useAppStore } from 'src/store/useAppStore';
import type { AnyPublication, MirrorablePublication } from '@lensshare/lens';
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import VideoPlayer from 'src/utils/VideoPlayer';
import { getPublication } from 'src/hooks/getPublication';
import { getPublicationMediaUrl } from 'src/hooks/getPublicationMediaUrl';
import { getThumbnailUrl } from 'src/hooks/getThumbnailUrl';
import { imageCdn } from 'src/hooks/imageCdn';
import BottomOverlay from './BottomOverlay';
import ByteActions from './ByteActions';
import { getPublicationData } from 'src/hooks/getPublicationData';

type Props = {
  publication: AnyPublication;
  currentViewingId: string;
  intersectionCallback: (id: string) => void;
};

const ByteVideo: FC<Props> = ({
  publication,
  currentViewingId,
  intersectionCallback
}) => {
  const videoRef = useRef<HTMLMediaElement>();
  const intersectionRef = useRef<HTMLDivElement>(null);
  const targetPublication = getPublication(publication);
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(targetPublication.metadata, true)),
    'THUMBNAIL_V'
  );

  const { currentProfile } = useAppStore();

  const playVideo = () => {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.currentTime = 0;
    videoRef.current.volume = 1;
    videoRef.current.autoplay = true;
    videoRef.current?.play().catch(() => {});
  };

  const observer = new IntersectionObserver((data) => {
    if (data[0].target.id && data[0].isIntersecting) {
      intersectionCallback(data[0].target.id);
      const nextUrl = `${location.origin}/bytes/${targetPublication}`;
      history.replaceState({ path: nextUrl }, '', nextUrl);
    }
  });

  useEffect(() => {
    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pauseVideo = () => {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.volume = 0;
    videoRef.current?.pause();
    videoRef.current.autoplay = false;
  };

  const onClickVideo = () => {
    if (videoRef.current?.paused) {
      playVideo();
    } else {
      pauseVideo();
    }
  };

  const refCallback = (ref: HTMLMediaElement) => {
    if (!ref) {
      return;
    }
    videoRef.current = ref;
    playVideo();
  };

  if (!publication) {
    return null;
  }

  return (
    <div className="keen-slider__slide  flex snap-center justify-center focus-visible:outline-none md:ml-16">
      <MetaTags title={getPublicationData(targetPublication.metadata)?.title} />
      <div className="relative">
        <div className="ultrawide:w-[650px] flex h-[calc(100vh-1px)] w-[calc(100vw-8px)] items-center overflow-hidden rounded-xl bg-black py-2 md:w-[450px]">
          <div
            className="absolute top-[30%] rounded-xl"
            ref={intersectionRef}
            id={targetPublication?.id}
          />
          <VideoPlayer
            address={currentProfile?.ownedBy.address}
            refCallback={refCallback}
            url={getPublicationMediaUrl(targetPublication.metadata)}
            posterUrl={thumbnailUrl}
            ratio="9to16"
            showControls={false}
            options={{
              autoPlay: currentViewingId === targetPublication.id,
              muted: currentViewingId !== targetPublication.id,
              loop: true,
              loadingSpinner: true,
              isCurrentlyShown: currentViewingId === publication.id
            }}
          />
        </div>
        <TopOverlay onClickVideo={onClickVideo} />
        <BottomOverlay video={publication as MirrorablePublication} />
        <div className="absolute bottom-[36%] right-2 z-[1]">
          <ByteActions video={publication} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ByteVideo);
