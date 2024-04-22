import { AspectRatio, Badge } from '@radix-ui/themes';

import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

import UploadMethod from './UploadMethod';

import { DocumentPlusIcon } from '@heroicons/react/24/outline';
import type { IPFSUploadResult } from 'src/types/custom-types';
import { uploadToIPFS } from 'src/hooks/uploadToIPFS';
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import { getTimeFromSeconds } from 'src/hooks/formatTime2';
import { formatBytes } from 'src/hooks/formatBytes';
import { Input, Tooltip } from '@lensshare/ui';
import { ALLOWED_AUDIO_TYPES } from '@lensshare/data/constants';
import Loader from '@components/Shared/Loader';
import ChooseThumbnail from './ChooseThumbnail';
import useBytesStore from 'src/store/persisted/bytes';


const SelectedMedia = () => {
  const mediaRef = useRef<HTMLVideoElement>(null);
  const [interacted, setInteracted] = useState(false);
  const [posterPreview, setPosterPreview] = useState('');

  const { irysData, setIrysData, getIrysInstance } = useBytesStore();
  const { uploadedMedia, setUploadedMedia } = useBytesStore();

  const onDataLoaded = () => {
    if (mediaRef.current?.duration && mediaRef.current?.duration !== Infinity) {
      setUploadedMedia({
        durationInSeconds: mediaRef.current.duration
          ? Math.floor(mediaRef.current.duration)
          : 0
      });
    }
  };

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.onloadeddata = onDataLoaded;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaRef]);

  const isAudio = ALLOWED_AUDIO_TYPES.includes(uploadedMedia.mediaType);

  const onClickVideo = () => {
    setInteracted(true);
    mediaRef.current?.paused
      ? mediaRef.current?.play()
      : mediaRef.current?.pause();
  };

  return (
    <div className="flex flex-col">
      {isAudio ? (
        <div className="flex w-full justify-end">
          <div className="md:rounded-large rounded-small w-full space-y-2 overflow-hidden border p-2 dark:border-gray-800">
            <AspectRatio ratio={1 / 1} className="group relative">
              {posterPreview ? (
                <img
                  src={posterPreview}
                  className="rounded-small h-full w-full object-cover"
                  draggable={false}
                  alt="poster"
                />
              ) : null}
              <label
                htmlFor="choosePoster"
                className={clsx(
                  'rounded-small invisible absolute top-0 grid h-full w-full cursor-pointer place-items-center overflow-hidden bg-gray-100 bg-opacity-70 backdrop-blur-lg group-hover:visible dark:bg-black',
                  {
                    '!visible':
                      uploadedMedia.uploadingThumbnail ||
                      !uploadedMedia.thumbnail.length
                  }
                )}
              >
                {uploadedMedia.uploadingThumbnail ? (
                  <Loader />
                ) : (
                  <span className="inline-flex flex-col items-center space-y-2">
                    <DocumentPlusIcon className="h-5 w-5" />
                    <span>Select Poster</span>
                  </span>
                )}
                <input
                  id="choosePoster"
                  type="file"
                  accept=".png, .jpg, .jpeg, .svg, .gif, .webp"
                  className="hidden w-full"
                  onChange={async (e) => {
                    if (e.target.files?.length) {
                      const file = e.target.files[0];
                      setUploadedMedia({ uploadingThumbnail: true });
                      const preview = URL.createObjectURL(file);
                      setPosterPreview(preview);
                      const { url }: IPFSUploadResult =
                        await uploadToIPFS(file);
                      setUploadedMedia({
                        uploadingThumbnail: false,
                        thumbnail: url
                      });
                    }
                  }}
                />
              </label>
            </AspectRatio>
            <audio
              ref={mediaRef}
              src={uploadedMedia.preview}
              className="w-full"
              controlsList="nodownload noplaybackrate"
              controls
            />
          </div>
        </div>
      ) : (
        <div className="md:rounded-large rounded-small relative w-full cursor-pointer overflow-hidden border dark:border-gray-800">
          <video
            ref={mediaRef}
            className="aspect-[16/9] w-full"
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noplaybackrate"
            poster={sanitizeDStorageUrl(uploadedMedia.thumbnail)}
            controls={false}
            autoPlay={interacted}
            muted={!interacted}
            onClick={() => onClickVideo()}
            src={uploadedMedia.preview}
          />
          <Badge
            onClick={() => onClickVideo()}
            variant="solid"
            radius="full"
            highContrast
            className="absolute bottom-2 right-2"
          >
            Play/Pause
          </Badge>
          <Badge
            variant="solid"
            radius="full"
            highContrast
            className="absolute bottom-2 left-2"
          >
            {uploadedMedia.file?.size && (
              <span className="space-x-1 whitespace-nowrap font-bold">
                <span>
                  {getTimeFromSeconds(String(uploadedMedia.durationInSeconds))}
                </span>
                <span>({formatBytes(uploadedMedia.file?.size)})</span>
              </span>
            )}
          </Badge>
          {uploadedMedia.durationInSeconds === 0 ? (
            <Badge
              variant="solid"
              radius="full"
              color="red"
              className="absolute right-3 top-3"
            >
              <span className="whitespace-nowrap font-bold">
                Only media files longer than 1 second are allowed
              </span>
            </Badge>
          ) : null}
          {Boolean(uploadedMedia.percent) ? (
            <Tooltip content={`Uploaded (${uploadedMedia.percent}%)`}>
              <div className="absolute bottom-0 w-full overflow-hidden bg-gray-200">
                <div
                  className={clsx(
                    'h-[6px]',
                    uploadedMedia.percent !== 0
                      ? 'bg-brand-500'
                      : 'bg-gray-300 dark:bg-gray-800'
                  )}
                  style={{
                    width: `${uploadedMedia.percent}%`
                  }}
                />
              </div>
            </Tooltip>
          ) : null}
        </div>
      )}
      {
        <div className="mt-4">
          <Input
            label="Upload from Source URL"
            placeholder="ar:// or ipfs://"
            value={uploadedMedia.dUrl}
            onChange={(e) =>
              setUploadedMedia({
                dUrl: e.target.value
              })
            }
          />
        </div>
      }
      {!isAudio && (
        <div className="mt-4">
          <ChooseThumbnail file={uploadedMedia.file}/>
        </div>
      )}
      <div className="rounded-lg">
        <UploadMethod />
      </div>
    </div>
  );
};

export default SelectedMedia;
