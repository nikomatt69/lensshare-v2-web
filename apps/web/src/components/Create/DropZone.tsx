
import UploadOutline from '@components/Icons/UploadOutline'
import { ALLOWED_AUDIO_TYPES, ALLOWED_MEDIA_TYPES } from '@lensshare/data/constants'
import logger from '@lensshare/lib/logger'
import { Box, Button } from '@radix-ui/themes'

import clsx from 'clsx'
import fileReaderStream from 'filereader-stream'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { CREATOR_VIDEO_CATEGORIES } from 'src/categories'
import { canUploadedToIpfs } from 'src/hooks/canUploadedToIpfs'
import { useDragAndDrop } from 'src/hooks/useDragAndDrop'
import useBytesStore from 'src/store/bytes'

const DropZone = () => {
  const setUploadedMedia = useBytesStore((state) => state.setUploadedMedia)

  const {
    dragOver,
    setDragOver,
    onDragOver,
    onDragLeave,
    fileDropError,
    setFileDropError
  } = useDragAndDrop()


  const handleUploadedMedia = (file: File) => {
    try {
      if (file) {
        const preview = URL.createObjectURL(file)
        const isAudio = ALLOWED_AUDIO_TYPES.includes(file?.type)
        const isUnderFreeLimit = canUploadedToIpfs(file?.size)
        setUploadedMedia({
          stream: fileReaderStream(file),
          preview,
          mediaType: file?.type,
          file,
          type:  'VIDEO',
         
          isUploadToIpfs: isUnderFreeLimit
        })
      }
    } catch (error) {
      toast.error('Error uploading file')
      logger.error('[Error Upload Media]')
    }
  }

  const validateFile = (file: File) => {
    if (!ALLOWED_MEDIA_TYPES.includes(file?.type)) {
      const errorMessage = `Media format (${file?.type}) not supported`
      toast.error(errorMessage)
      return setFileDropError(errorMessage)
    }
    handleUploadedMedia(file)
  }

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragOver(false)
    validateFile(e?.dataTransfer?.files[0])
  }

  const onChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      validateFile(e?.target?.files[0])
    }
  }

  return (
    <div className="relative flex w-full flex-1 flex-col">
      <label
        className={clsx(
          'grid w-full place-items-center rounded-3xl border border-dashed p-10 text-center focus:outline-none md:p-20',
          dragOver ? 'border-green-500' : 'border-gray-500'
        )}
        htmlFor="dropMedia"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          type="file"
          className="hidden"
          onChange={onChooseFile}
          id="dropMedia"
          accept={ALLOWED_MEDIA_TYPES.join(',')}
        />
        <span className="mb-6 flex justify-center opacity-80">
          <UploadOutline className="h-10 w-10" />
        </span>
        <span className="space-y-10">
          <div className="space-y-4">
            <p className="text-2xl md:text-4xl">Drag and drop</p>
            <p>Select multimedia from your device.</p>
          </div>
          <Box>
            <Button
              highContrast
              variant="surface"
              className="!px-0"
              type="button"
            >
              <label htmlFor="chooseMedia" className="cursor-pointer p-6">
                Choose
                <input
                  id="chooseMedia"
                  onChange={onChooseFile}
                  type="file"
                  className="hidden"
                  accept={ALLOWED_MEDIA_TYPES.join(',')}
                />
              </label>
            </Button>
          </Box>
          {fileDropError && (
            <div className="font-medium text-red-500">{fileDropError}</div>
          )}
        </span>
      </label>
    </div>
  )
}

export default DropZone
