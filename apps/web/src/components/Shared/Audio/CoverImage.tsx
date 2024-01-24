import { PhotoIcon } from '@heroicons/react/24/outline';
import { ATTACHMENT } from '@lensshare/data/constants';
import imageKit from '@lensshare/lib/imageKit';
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import { Image, Spinner } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import errorToast from '@lib/errorToast';
import { uploadFileToIPFS } from '@lib/uploadToIPFS';
import type { ChangeEvent, FC, Ref } from 'react';
import { useState } from 'react';

interface CoverImageProps {
  isNew: boolean;
  cover: string;
  setCover: (previewUri: string, url: string) => void;
  imageRef: Ref<HTMLImageElement>;
  expandCover: (url: string) => void;
}

const CoverImage: FC<CoverImageProps> = ({
  isNew = false,
  cover,
  setCover,
  imageRef,
  expandCover
}) => {
  const [loading, setLoading] = useState(false);

  const onError = (error: any) => {
    setLoading(false);
    errorToast(error);
  };

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      try {
        setLoading(true);
        const file = event.target.files[0];
        const attachment = await uploadFileToIPFS(file);
        setCover(URL.createObjectURL(file), attachment.uri);
      } catch (error) {
        onError(error);
      }
    }
  };

  return (
    <div className="group relative flex-none overflow-hidden rounded-xl">
      <button
        type="button"
        className="flex focus:outline-none"
        onClick={() => expandCover(cover ? sanitizeDStorageUrl(cover) : cover)}
      >
        <Image
          onError={({ currentTarget }) => {
            currentTarget.src = cover ? sanitizeDStorageUrl(cover) : cover;
          }}
          src={cover ? imageKit(sanitizeDStorageUrl(cover), ATTACHMENT) : cover}
          className="h-24 w-24 rounded-xl object-cover md:h-40 md:w-40 md:rounded-none"
          draggable={false}
          alt={`attachment-audio-cover-${cover}`}
          ref={imageRef}
        />
      </button>
      {isNew ? (
        <label
          className={cn(
            { visible: loading && !cover, invisible: cover },
            'absolute top-0 grid h-24 w-24 cursor-pointer place-items-center bg-gray-100 backdrop-blur-lg group-hover:visible dark:bg-gray-900 md:h-40 md:w-40'
          )}
        >
          {loading && !cover ? (
            <Spinner size="sm" />
          ) : (
            <div className="flex flex-col items-center text-sm text-black opacity-60 dark:text-white">
              <PhotoIcon className="h-5 w-5" />
              <span>Add cover</span>
            </div>
          )}
          <input
            type="file"
            accept=".png, .jpg, .jpeg, .svg"
            className="hidden w-full"
            onChange={onChange}
          />
        </label>
      ) : null}
    </div>
  );
};

export default CoverImage;
