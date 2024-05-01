import type { CachedConversation } from '@xmtp/react-sdk';
import type { ChangeEvent, FC } from 'react';

import { MESSAGES } from '@lensshare/data/tracking';
import { Button, Input } from '@lensshare/ui';
import { useSendMessage } from '@xmtp/react-sdk';
import { useEffect, useRef, useState } from 'react';

import { PhoneIcon } from '@heroicons/react/24/outline';

import { AudioRecorder } from 'react-audio-voice-recorder';

import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import { uploadToIPFS } from 'src/hooks/uploadToIPFS';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import Link from 'next/link';
import { Leafwatch } from '@lib/leafwatch';

interface ComposerProps {
  conversation: CachedConversation;
}

const Composer: FC<ComposerProps> = ({ conversation }) => {
  const [show, setShow] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useSendMessage();

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
    audioDataURL: string
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
      const messageContent = `Vocal : [${sanitizeDStorageUrl(
        uploadResult.url
      )}]`;

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
        await sendAudioAttachment(conversation, reader.result); // Corrected typo in ContentTypeAudioKey // Corrected typo in ContentTypeAudioKey
        setMessage('');
      }
    };
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversation]);

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (conversation.peerAddress && message) {
      setMessage('');
      inputRef.current?.focus();
      await sendMessage(conversation, message);
     
    }
  };
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

        <Input
          autoFocus
          onChange={handleMessageChange}
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
