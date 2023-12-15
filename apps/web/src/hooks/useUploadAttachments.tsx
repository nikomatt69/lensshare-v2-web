import type { NewAttachment } from '@lensshare/types/misc';
import uploadToIPFS from '@lib/uploadToIPFS';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { usePublicationStore } from 'src/store/usePublicationStore';
import { v4 as uuid } from 'uuid';

const useUploadAttachments = () => {
  const {
    addAttachments,
    updateAttachments,
    removeAttachments,
    setIsUploading,
    setUploadedPercentage
  } = usePublicationStore();

  const handleUploadAttachments = useCallback(
    async (attachments: any): Promise<NewAttachment[]> => {
      setIsUploading(true);
      const files = Array.from(attachments);
      const attachmentIds: string[] = [];

      const previewAttachments: NewAttachment[] = files.map((file: any) => {
        const attachmentId = uuid();
        attachmentIds.push(attachmentId);

        return {
          id: attachmentId,
          type: file.type.includes('image')
            ? 'Image'
            : file.type.includes('video')
            ? 'Video'
            : 'Audio',
          mimeType: file.type,
          uri: URL.createObjectURL(file),
          previewUri: URL.createObjectURL(file),
          file
        };
      });

      const hasLargeAttachment = files.map((file: any) => {
        const isImage = file.type.includes('image');
        const isVideo = file.type.includes('video');
        const isAudio = file.type.includes('audio');

        if (isImage && file.size > 50000000) {
          toast.error('Image size should be less than 50MB');
          return false;
        }

        if (isVideo && file.size > 500000000) {
          toast.error('Video size should be less than 500MB');
          return false;
        }

        if (isAudio && file.size > 100000000) {
          toast.error('Audio size should be less than 100MB');
          return false;
        }

        return true;
      });

      addAttachments(previewAttachments);
      let attachmentsIPFS: NewAttachment[] = [];
      try {
        if (hasLargeAttachment.includes(false)) {
          setIsUploading(false);
          removeAttachments(attachmentIds);
          return [];
        }

        const attachmentsUploaded = await uploadToIPFS(
          attachments,
          (percentCompleted) => setUploadedPercentage(percentCompleted)
        );
        if (attachmentsUploaded) {
          attachmentsIPFS = previewAttachments.map(
            (attachment: NewAttachment, index: number) => ({
              ...attachment,
              uri: attachmentsUploaded[index].uri,
              mimeType: attachmentsUploaded[index].mimeType
            })
          );
          updateAttachments(attachmentsIPFS);
        }
      } catch {
        removeAttachments(attachmentIds);
        toast.error('Something went wrong while uploading!');
      }
      setIsUploading(false);

      return attachmentsIPFS;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addAttachments, removeAttachments, updateAttachments, setIsUploading]
  );

  return { handleUploadAttachments };
};

export default useUploadAttachments;
