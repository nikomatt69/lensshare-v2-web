import type { CachedConversation } from '@xmtp/react-sdk';
import type { ChangeEvent, FC } from 'react';

import { Button, Input } from '@lensshare/ui';
import { useSendMessage, useStreamAllMessages } from '@xmtp/react-sdk';
import { useEffect, useRef, useState } from 'react';

import { PhoneIcon, PhotoIcon } from '@heroicons/react/24/outline';

import { type Attachment as TAttachment } from 'xmtp-content-type-remote-attachment';
import { AudioRecorder } from 'react-audio-voice-recorder';
import {
  useAttachmentCachePersistStore,
  useAttachmentStore
} from 'src/store/attachment';
import toast from 'react-hot-toast';
import { ContentTypeAudioeKey } from 'src/hooks/codecs/Audio';
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import { uploadToIPFS } from 'src/hooks/uploadToIPFS';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import Link from 'next/link';

interface ComposerProps {
  conversation: CachedConversation;
}

const Composer: FC<ComposerProps> = ({ conversation }) => {
  interface AttachmentPreviewProps {
    onDismiss: () => void;
    dismissDisabled: boolean;
    attachment: TAttachment;
  }

  /**
   * This component is for displaying the attachment preview in the messages
   * list before it's uploaded and sent to the network. It matches how the
   * attachment is rendered when retrieved from the network.
   */

  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useSendMessage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sending, setSending] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<TAttachment | null>(null);
  const canSendMessage = attachment || message.length > 0;

  const addLoadedAttachmentURL = useAttachmentStore(
    (state) => state.addLoadedAttachmentURL
  );
  const cacheAttachment = useAttachmentCachePersistStore(
    (state) => state.cacheAttachment
  );

  const [show, setShow] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversation]);

  const onDismiss = () => {
    setAttachment(null);

    const el = fileInputRef.current;
    if (el) {
      el.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      if (attachment) {
        const sentAttachment = await sendMessage(conversation, message); // Assume this function handles sending the attachment
        if (!sentAttachment) {
          toast.error(`Error sending attachment`);
        }
      }

      if (message) {
        await sendMessage(conversation, message);
        setMessage('');
        inputRef.current?.focus();
      }
    } catch (error) {
      toast.error(`Error sending message`);
    } finally {
      setSending(false);
    }
  };

  const dataURLToBlob = (dataURL: string): Blob | null => {
    const arr = dataURL.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream'; // Default MIME type if not found
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  };
  const sendAudioAttachment = async (
    conversation: CachedConversation,
    audioDataURL: string,
   
  ): Promise<void> => {
    try {
      // Convert Data URL to Blob
      const audioBlob = dataURLToBlob(audioDataURL);
      if (!audioBlob) {
        console.error('Failed to convert audio data URL to Blob');
        return;
      }

      // Simulate uploading the audio file
      const uploadResult = await uploadToIPFS(audioBlob as File);
      if (!uploadResult) {
        console.error('Failed to upload audio');
        return;
      }

      // Construct a message with the audio attachment URL
      const messageContent = `Vocal : [${sanitizeDStorageUrl(uploadResult.url)}]`;

      await sendMessage(conversation, messageContent);
    } catch (error) {
      console.error('Error sending audio attachment:', error);
    }
  };
  const addAudioElement = (blob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        // Assuming a function that handles creating and sending an audio attachment
        await sendAudioAttachment(
          conversation,
          reader.result,
        
        ); // Corrected typo in ContentTypeAudioKey // Corrected typo in ContentTypeAudioKey
        setMessage('');
      }
    };
  };

  const onAttachmentChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];

      const fileReader = new FileReader();
      fileReader.addEventListener('load', async function () {
        const data = fileReader.result;

        if (!(data instanceof ArrayBuffer)) {
          return;
        }

        const attachment: TAttachment = {
          filename: file.name,
          mimeType: file.type,
          data: new Uint8Array(data)
        };

        setAttachment(attachment);
      });

      fileReader.readAsArrayBuffer(file);
    } else {
      setAttachment(null);
    }
  };

  useEffect(() => {
    setMessage(message ?? '');
    // only run this effect when the conversation changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation]);

  const handleMessageChange = (value: string) => {
    setMessage(value);
  };
  useStreamAllMessages();
  return (
    <div className="border-t dark:border-gray-700">
      <form
        className="flex items-center space-x-2 border-t p-4 dark:border-gray-700"
        onSubmit={handleSendMessage}
      >
        <img
          src={`${STATIC_ASSETS_URL}/images/camera-video.svg`}
          onClick={async () => {
            const apiCall = await fetch('/api/create-room', {
              mode: 'no-cors',
              method: 'POST',
              body: JSON.stringify({
                title: 'MyCrumbs-Space'
              }),
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'wWUkmfVYqMCcYLKEGA8VE1fZ4hWyo5d0' || ''
              }
            });
            const data = (await apiCall.json()) as {
              data: { roomId: string };
            };
            const { roomId } = data.data;
            const currentUrl = window.location.href;
            const url = currentUrl.match(/^https?:\/\/([^/]+)/)?.[0];
            const meetingUrl = `${url}/meet/${roomId}`;

            setMessage(meetingUrl);

            // Instead of sending a message, set the meeting URL in the state
            sendMessage(conversation, message);
            // Instead of sending a message, set the meeting URL in the state
            setShow(true);
            setMeetingUrl(meetingUrl);
          }}
          className="text-brand inline h-6 w-6 cursor-pointer"
        />
        <div className="hidden">
          {show && (
            <Link href={meetingUrl}>
              <PhoneIcon className="h-6 w-6 text-green-500" />
            </Link>
          )}
        </div>

        
          <AudioRecorder showVisualizer onRecordingComplete={addAudioElement} />
       
        <label className="flex cursor-pointer items-center">
          <PhotoIcon className="text-brand-500 h-6 w-5" />
          <input
            ref={fileInputRef}
            type="file"
            accept=".png, .jpg, .jpeg, .gif"
            className="hidden w-full"
            onChange={onAttachmentChange}
          />
        </label>
        
        <Input
          autoFocus
          onChange={(event) => handleMessageChange(event.target.value)}
          placeholder="Type a message..."
          ref={inputRef}
          type="text"
          value={message}
        />
        <Button disabled={!message} type="submit">
          Send
        </Button>
       
      </form>
    </div>
  );
};

export default Composer;
