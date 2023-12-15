import ChooseThumbnail from '@components/Composer/ChooseThumbnail';
import { XMarkIcon } from '@heroicons/react/24/outline';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import type { NewAttachment } from '@lensshare/types/misc';
import { Button, Image } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import type { FC } from 'react';
import { useRef } from 'react';
import { usePublicationStore } from 'src/store/usePublicationStore';
import { useUpdateEffect } from 'usehooks-ts';

import Audio from './Audio';

const getClass = (attachments: number) => {
  if (attachments === 1) {
    return {
      aspect: 'aspect-w-16 aspect-h-10',
      row: 'grid-cols-1 grid-rows-1'
    };
  } else if (attachments === 2) {
    return {
      aspect: 'aspect-w-16 aspect-h-12',
      row: 'grid-cols-2 grid-rows-1'
    };
  } else if (attachments > 2) {
    return {
      aspect: 'aspect-w-16 aspect-h-12',
      row: 'grid-cols-2 grid-rows-2'
    };
  }
};

interface NewAttachmentsProps {
  attachments: NewAttachment[];
  hideDelete?: boolean;
}

const NewAttachments: FC<NewAttachmentsProps> = ({
  attachments = [],
  hideDelete = false
}) => {
  const setAttachments = usePublicationStore((state) => state.setAttachments);
  const setVideoDurationInSeconds = usePublicationStore(
    (state) => state.setVideoDurationInSeconds
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  const onDataLoaded = () => {
    if (videoRef.current?.duration && videoRef.current?.duration !== Infinity) {
      setVideoDurationInSeconds(videoRef.current.duration.toFixed(2));
    }
  };

  useUpdateEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadeddata = onDataLoaded;
    }
  }, [videoRef, attachments]);

  const removeAttachment = (attachment: any) => {
    const arr = attachments;
    setAttachments(
      arr.filter((element: any) => {
        return element !== attachment;
      })
    );
  };

  const slicedAttachments = attachments?.some(
    (attachment: NewAttachment) =>
      attachment.type === 'Video' || attachment.type === 'Audio'
  )
    ? attachments?.slice(0, 1)
    : attachments?.slice(0, 4);
  const attachmentsLength = slicedAttachments?.length;

  return attachmentsLength !== 0 ? (
    <div className={cn(getClass(attachmentsLength)?.row, 'mt-3 grid gap-2')}>
      {slicedAttachments?.map((attachment: NewAttachment, index: number) => {
        const isImage = attachment.type === 'Image';
        const isAudio = attachment.type === 'Audio';
        const isVideo = attachment.type === 'Video';

        return (
          <div
            className={cn(
              isImage
                ? `${getClass(attachmentsLength)?.aspect} ${
                    attachmentsLength === 3 && index === 0 ? 'row-span-2' : ''
                  }`
                : '',
              {
                'w-full': isAudio || isVideo,
                'w-2/3': isImage && attachmentsLength === 1
              },
              'relative'
            )}
            key={index}
            onClick={stopEventPropagation}
            aria-hidden="true"
          >
            {isVideo ? (
              <>
                <video
                  className="w-full overflow-hidden rounded-xl"
                  src={attachment.previewUri}
                  ref={videoRef}
                  disablePictureInPicture
                  disableRemotePlayback
                  controlsList="nodownload noplaybackrate"
                  controls
                />
                <ChooseThumbnail />
              </>
            ) : isAudio ? (
              <Audio
                src={attachment.previewUri}
                poster=""
                isNew
                expandCover={() => {}}
              />
            ) : isImage ? (
              <Image
                className="cursor-pointer rounded-lg border bg-gray-100 object-cover dark:border-gray-700 dark:bg-gray-800"
                loading="lazy"
                height={1000}
                width={1000}
                onError={({ currentTarget }) => {
                  currentTarget.src = attachment.previewUri;
                }}
                src={attachment.previewUri}
                alt={attachment.previewUri}
              />
            ) : null}
            {!hideDelete &&
              (isVideo ? (
                <Button
                  className="mt-3"
                  variant="danger"
                  size="sm"
                  icon={<XMarkIcon className="h-4 w-4" />}
                  onClick={() => removeAttachment(attachment)}
                  outline
                >
                  Cancel Upload
                </Button>
              ) : (
                <div className={cn(isAudio ? 'absolute left-2 top-2' : 'm-3')}>
                  <button
                    type="button"
                    className="rounded-full bg-gray-900 p-1.5 opacity-75"
                    onClick={() => removeAttachment(attachment)}
                  >
                    <XMarkIcon className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
          </div>
        );
      })}
    </div>
  ) : null;
};

export default NewAttachments;
