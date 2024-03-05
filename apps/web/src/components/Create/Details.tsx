import '@radix-ui/themes/styles.css';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Flex, Switch, Text, Theme } from '@radix-ui/themes';

import clsx from 'clsx';
import type { FC } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import type { z } from 'zod';
import { boolean, object, string } from 'zod';

import DropZone from './DropZone';

import SelectedMedia from './SelectedMedia';
import { checkIsBytesVideo } from 'src/hooks/checkIsBytesVideo';
import useBytesStore from 'src/store/bytes';
import TooltipBytes from './TooltipBytes';
import InputMentions from './InputMentions';

const formSchema = object({
  title: string()
    .trim()
    .min(5, { message: `Title should be atleast 5 characters` })
    .max(100, { message: `Title should not exceed 100 characters` }),
  description: string()
    .trim()
    .min(5, { message: `Description should be atleast 5 characters` })
    .max(5000, { message: `Description should not exceed 5000 characters` }),
  isSensitiveContent: boolean()
});

export type VideoFormData = z.infer<typeof formSchema>;

type Props = {
  onUpload: (data: VideoFormData) => void;
  onCancel: () => void;
};

const Details: FC<Props> = ({ onUpload, onCancel }) => {
  const uploadedMedia = useBytesStore((state) => state.uploadedMedia);
  const setUploadedMedia = useBytesStore((state) => state.setUploadedMedia);
  const isByteSizeVideo = checkIsBytesVideo(uploadedMedia.durationInSeconds);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors
  } = useForm<VideoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isSensitiveContent: uploadedMedia.isSensitiveContent ?? false,
      title: uploadedMedia.title,
      description: uploadedMedia.description
    }
  });

  const onSubmitForm = (data: VideoFormData) => {
    if (!uploadedMedia.file) {
      return toast.error(`Please choose a media to upload`);
    }
    if (!uploadedMedia.thumbnail?.length) {
      return toast.error(`Please select or upload a thumbnail`);
    }
    onUpload(data);
  };

  const toggleUploadAsByte = (enable: boolean) => {
    if (isByteSizeVideo && enable) {
      return setUploadedMedia({ isByteVideo: true });
    }
    setUploadedMedia({ isByteVideo: false });
  };

  return (
    <Theme>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="flex h-full flex-row flex-wrap gap-4">
          <div className="w-full md:w-2/5">
            {uploadedMedia.file ? <SelectedMedia /> : <DropZone />}
          </div>
          <div className="flex flex-1  justify-between">
            <div className="flex-col p-3">
              <div className="relative">
                <InputMentions
                  label="Title"
                  placeholder="Title"
                  validationError={errors.title?.message}
                  value={watch('title')}
                  onContentChange={(value) => {
                    setValue('title', value);
                    clearErrors('title');
                  }}
                  rows={5}
                  mentionsSelector="input-mentions-single"
                />
                <div className="absolute right-1 top-0 flex items-center justify-end">
                  <span
                    className={clsx(
                      'text-xs',
                      watch('title')?.length > 100
                        ? 'text-red-500 opacity-100'
                        : ' opacity-70'
                    )}
                  >
                    {watch('title')?.length}/100
                  </span>
                </div>
              </div>
              <div className="relative mt-4">
                <InputMentions
                  label="Description"
                  placeholder="Description"
                  validationError={errors.description?.message}
                  value={watch('description')}
                  onContentChange={(value) => {
                    setValue('description', value);
                    clearErrors('description');
                  }}
                  rows={5}
                  mentionsSelector="input-mentions-textarea"
                />

                <div className="absolute right-1 top-0 mt-1 flex items-center justify-end">
                  <span
                    className={clsx(
                      'text-xs',
                      watch('description')?.length > 5000
                        ? 'text-red-500 opacity-100'
                        : ' opacity-70'
                    )}
                  >
                    {watch('description')?.length}/5000
                  </span>
                </div>
              </div>

              {uploadedMedia.file && uploadedMedia.type === 'VIDEO' ? (
                <TooltipBytes
                  visible={!isByteSizeVideo}
                  content="Please note that only videos under 2 minutes in length can be uploaded as bytes"
                >
                  <div
                    className={clsx(
                      'mt-2',
                      !isByteSizeVideo && 'cursor-not-allowed opacity-50'
                    )}
                  >
                    <Text as="label">
                      <Flex gap="2" align="center">
                        <Switch
                          highContrast
                          checked={Boolean(uploadedMedia.isByteVideo)}
                          onCheckedChange={(b) => toggleUploadAsByte(b)}
                        />
                        Upload this video as short-form bytes
                      </Flex>
                    </Text>
                  </div>
                </TooltipBytes>
              ) : null}

              <div className="mt-2">
                <Text as="label">
                  <Flex gap="2" align="center">
                    <Switch
                      highContrast
                      checked={Boolean(watch('isSensitiveContent'))}
                      onCheckedChange={(value) =>
                        setValue('isSensitiveContent', value)
                      }
                    />
                    Sensitive content for a general audience
                  </Flex>
                </Text>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end space-x-2">
          <Button
            type="button"
            color="gray"
            variant="soft"
            disabled={uploadedMedia.loading}
            onClick={() => onCancel()}
          >
            Reset
          </Button>
          <Button
            highContrast
            disabled={
              uploadedMedia.loading ||
              uploadedMedia.uploadingThumbnail ||
              uploadedMedia.durationInSeconds === 0
            }
            type="submit"
          >
            {uploadedMedia.uploadingThumbnail
              ? 'Uploading image...'
              : uploadedMedia.buttonText}
          </Button>
        </div>
      </form>
    </Theme>
  );
};

export default Details;
