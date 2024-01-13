import type { NewAttachment } from '@lensshare/types/misc';

import { create } from 'zustand';

interface PublicationAttachmentState {
  addAttachments: (attachments: NewAttachment[]) => void;
  attachments: NewAttachment[];
  isUploading: boolean;
  removeAttachments: (ids: string[]) => void;
  setAttachments: (attachments: NewAttachment[]) => void;
  setIsUploading: (isUploading: boolean) => void;
  updateAttachments: (attachments: NewAttachment[]) => void;
}

export const usePublicationAttachmentStore = create<PublicationAttachmentState>(
  (set) => ({
    addAttachments: (newAttachments) =>
      set((state) => {
        return { attachments: [...state.attachments, ...newAttachments] };
      }),
    attachments: [],
    isUploading: false,
    removeAttachments: (ids) =>
      set((state) => {
        const attachments = [...state.attachments];
        ids.map((id) => {
          const index = attachments.findIndex((a) => a.id === id);
          if (index !== -1) {
            attachments.splice(index, 1);
          }
        });
        return { attachments };
      }),
    setAttachments: (attachments) => set(() => ({ attachments })),
    setIsUploading: (isUploading) => set(() => ({ isUploading })),
    updateAttachments: (updateAttachments) =>
      set((state) => {
        const attachments = [...state.attachments];
        updateAttachments.map((attachment) => {
          const index = attachments.findIndex((a) => a.id === attachment.id);
          if (index !== -1) {
            attachments[index] = attachment;
          }
        });
        return { attachments };
      })
  })
);
