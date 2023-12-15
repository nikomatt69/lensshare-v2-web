import { AspectRatio, Grid } from '@radix-ui/themes';

import clsx from 'clsx';
import type { ChangeEvent, FC } from 'react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import type { IPFSUploadResult } from 'src/types/custom-types';
import useBytesStore from 'src/store/bytes';
import getFileFromDataURL from '@lensshare/lib/getFileFromDataURL';
import { generateVideoThumbnails } from '@lensshare/lib/generateVideoThumbnails';
import logger from '@lensshare/lib/logger';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';
import ThumbnailsShimmer from '@components/Shared/Shimmer/ThumbnailsShimmer';
import Loader from '@components/Shared/Loader';
import { uploadToIPFS } from 'src/hooks/uploadToIPFS';

interface Props {
  file: File | null;
}

const DEFAULT_THUMBNAIL_INDEX = 0;
export const THUMBNAIL_GENERATE_COUNT = 9;

type Thumbnail = {
  blobUrl: string;
  ipfsUrl: string;
  mimeType: string;
};

const ChooseThumbnail: FC<Props> = ({ file }) => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(-1);
  const uploadedMedia = useBytesStore((state) => state.uploadedMedia);
  const setUploadedMedia = useBytesStore((state) => state.setUploadedMedia);

  const uploadThumbnailToIpfs = async (fileToUpload: File) => {
    setUploadedMedia({ uploadingThumbnail: true });
    const result: IPFSUploadResult = await uploadToIPFS(fileToUpload);
    if (!result.url) {
      toast.error(`Failed to upload thumbnail`);
    }
    setUploadedMedia({
      thumbnail: result.url,
      thumbnailType: fileToUpload.type || 'image/jpeg',
      uploadingThumbnail: false
    });
    return result;
  };

  const onSelectThumbnail = async (index: number) => {
    if (uploadedMedia.durationInSeconds === 0) {
      return;
    }
    setSelectedThumbnailIndex(index);
    if (thumbnails[index]?.ipfsUrl === '') {
      setUploadedMedia({ uploadingThumbnail: true });
      getFileFromDataURL(
        thumbnails[index].blobUrl,
        'thumbnail.jpeg',
        async (file) => {
          if (!file) {
            return toast.error(`Please upload a custom thumbnail`);
          }
          const ipfsResult = await uploadThumbnailToIpfs(file);
          setThumbnails(
            thumbnails.map((thumbnail, i) => {
              if (i === index) {
                thumbnail.ipfsUrl = ipfsResult?.url;
              }
              return thumbnail;
            })
          );
        }
      );
    } else {
      setUploadedMedia({
        thumbnail: thumbnails[index]?.ipfsUrl,
        thumbnailType: thumbnails[index]?.mimeType || 'image/jpeg',
        uploadingThumbnail: false
      });
    }
  };

  const generateThumbnails = async (fileToGenerate: File) => {
    try {
      const thumbnailArray = await generateVideoThumbnails(
        fileToGenerate,
        THUMBNAIL_GENERATE_COUNT
      );
      const thumbnailList: Thumbnail[] = [];
      for (const thumbnailBlob of thumbnailArray) {
        thumbnailList.push({
          blobUrl: thumbnailBlob,
          ipfsUrl: '',
          mimeType: 'image/jpeg'
        });
      }
      setThumbnails(thumbnailList);
      setSelectedThumbnailIndex(DEFAULT_THUMBNAIL_INDEX);
    } catch {}
  };

  useEffect(() => {
    onSelectThumbnail(selectedThumbnailIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedThumbnailIndex]);

  useEffect(() => {
    if (file) {
      generateThumbnails(file).catch((error) => logger.error(error));
    }
    return () => {
      setSelectedThumbnailIndex(-1);
      setThumbnails([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setSelectedThumbnailIndex(-1);
      toast.loading(`Uploading thumbnail`);
      const file = e.target.files[0];
      const result = await uploadThumbnailToIpfs(file);
      const preview = window.URL?.createObjectURL(file);
      setThumbnails([
        {
          blobUrl: preview,
          ipfsUrl: result.url,
          mimeType: file.type || 'image/jpeg'
        },
        ...thumbnails
      ]);
      setSelectedThumbnailIndex(0);
    }
  };

  return (
    <Grid columns="5" gap="2">
      <label
        htmlFor="chooseThumbnail"
        className="flex h-full w-full flex-none cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-300 opacity-80 focus:outline-none dark:border-gray-700"
      >
        <input
          id="chooseThumbnail"
          type="file"
          accept=".png, .jpg, .jpeg, .webp"
          className="hidden w-full"
          onChange={handleUpload}
        />
        <DocumentPlusIcon className="mb-1 h-4 w-4 flex-none" />
        <span className="text-xs">Upload</span>
      </label>
      {!thumbnails.length && uploadedMedia.file?.size ? (
        <ThumbnailsShimmer />
      ) : null}
      {thumbnails.map((thumbnail, idx) => {
        return (
          <button
            key={idx}
            type="button"
            disabled={uploadedMedia.uploadingThumbnail}
            onClick={() => onSelectThumbnail(idx)}
            className={clsx(
              'relative w-full flex-none overflow-hidden rounded-lg ring-1 ring-white focus:outline-none disabled:!cursor-not-allowed dark:ring-black',
              {
                '!ring-brand-500 !ring':
                  thumbnail.ipfsUrl &&
                  selectedThumbnailIndex === idx &&
                  thumbnail.ipfsUrl === uploadedMedia.thumbnail
              }
            )}
          >
            <AspectRatio ratio={16 / 9}>
              <img
                className={clsx(
                  'h-full w-full rounded-lg',
                  uploadedMedia.isByteVideo ? 'object-contain' : 'object-cover'
                )}
                src={thumbnail.blobUrl}
                alt="thumbnail"
                draggable={false}
              />
            </AspectRatio>
            {uploadedMedia.uploadingThumbnail &&
              selectedThumbnailIndex === idx && (
                <div className="absolute inset-0 grid place-items-center bg-gray-100 bg-opacity-10 backdrop-blur-md">
                  <Loader />
                </div>
              )}
          </button>
        );
      })}
    </Grid>
  );
};

export default ChooseThumbnail;
