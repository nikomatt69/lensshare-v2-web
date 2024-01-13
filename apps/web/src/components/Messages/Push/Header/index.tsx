import Slug from '@components/Shared/Slug';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import getAvatar2 from '@lensshare/lib/getAvatar2';
import getStampFyiURL from '@lensshare/lib/getStampFyiURL';
import { Card, Image } from '@lensshare/ui';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';

import { useAppStore } from 'src/store/useAppStore';
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import { computeSendPayload, createTemporaryMessage } from '../helper';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';
import toast from 'react-hot-toast';
import usePushHooks from 'src/hooks/messaging/push/usePush';
import type { Message } from '@pushprotocol/restapi';
import type { Profile } from 'src/store/persisted/usePushChatStore';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';
import type { DisplayedMessage } from '@lib/mapReactionsToMessages';
import formatAddress from '@lensshare/lib/formatAddress';
import getAvatar from '@lensshare/lib/getAvatar';
interface MessageHeaderProps {
  profile?: Profile;
}

export default function Header({ profile }: MessageHeaderProps) {
  const avatar = getAvatar(profile?.id);
  const [show, setShow] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState('');
  const { decryptConversation, useSendMessage } = usePushHooks();
  const { mutateAsync: sendMessage } = useSendMessage();
  const attachments = usePublicationStore((state) => state.attachments);
  const addAttachments = usePublicationStore((state) => state.addAttachments);
  const removeAttachments = usePublicationStore(
    (state) => state.removeAttachments
  );
  const isUploading = usePublicationStore((state) => state.isUploading);
  const replyToMessage = usePushChatStore((state) => state.replyToMessage);
  const setRecipientChat = usePushChatStore((state) => state.setRecipientChat);
  const setReplyToMessage = usePushChatStore(
    (state) => state.setReplyToMessage
  );

  const canSendMessage = attachments.length > 0 || message.length > 0;

  const isURL = (input: string) => {
    let url;
    try {
      url = new URL(input);
    } catch (error) {
      return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
  };

  const sendMessageAndHandleResponse = async (messageContent: Message) => {
    try {
      const tempMessage = createTemporaryMessage(
        messageContent,
        currentProfile?.id!
      );
      console.log(tempMessage, 'tempMessage');

      setRecipientChat([tempMessage]);

      const sentMessage = await sendMessage(messageContent);
      const decryptedMessage = await decryptConversation(sentMessage);
      setReplyToMessage(null);
      setRecipientChat([decryptedMessage], tempMessage.cid);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  const handleSend = async () => {
    if (!canSendMessage) {
      return;
    }

    const reference = replyToMessage?.cid ?? null;

    if (attachments.length > 0) {
      for (const attachment of attachments) {
        const sanitizedUrl = sanitizeDStorageUrl(attachment.uri);
        const messageContent = computeSendPayload({
          content: {
            content: sanitizedUrl,
            type: MessageType.MEDIA_EMBED
          },
          ...(reference !== null && {
            reference: reference,
            type: MessageType.REPLY
          })
        });
        removeAttachments([attachment!.id!]);
        await sendMessageAndHandleResponse(messageContent);
      }
    }

    const messageType = isURL(message)
      ? MessageType.MEDIA_EMBED
      : MessageType.TEXT;

    const messageContent = computeSendPayload({
      content: { content: message, type: messageType },
      ...(reference !== null && {
        reference: reference,
        type: MessageType.REPLY
      })
    });
    setMessage('');
    await sendMessageAndHandleResponse(messageContent);
  };

  const [replyMessage, setReplyMessage] = useState<DisplayedMessage | null>(
    null
  );

  const onSendMessage = useCallback(
    async (message: string) => {
      if (!message) {
        return;
      }
      const reference = replyMessage?.link;
      if (!reference) {
        await sendMessage({ content: message, type: 'Text' });
      } else {
        setReplyMessage(null);
        await sendMessage({
          content: { content: message, type: 'Text' },
          reference: reference,
          type: 'Reply'
        });
      }
      setReplyMessage(null);
    },
    [replyMessage, sendMessage]
  );

  return (
    <section className="flex w-full justify-between border-b px-5	py-2.5">
      <div className="flex items-center">
        {profile ? (
          <div className="flex flex-row items-center space-x-3">
            <Image
              className="h-12 w-12 rounded-full border bg-gray-200 dark:border-gray-700"
              height={40}
              loading="lazy"
              onError={({ currentTarget }) => {
                currentTarget.src = avatar;
              }}
              src={getStampFyiURL(profile.ownedBy.address)}
              width={40}
            />

            <div className="flex flex-col">
              <p className="text-base">
                {formatAddress(profile?.ownedBy.address)}
              </p>
              <Slug
                className="text-sm"
                prefix="@"
                slug={profile.localHandle!}
              />
            </div>
          </div>
        ) : null}
        <img
          src={`${STATIC_ASSETS_URL}/images/camera-video.svg`}
          onClick={async () => {
            const apiCall = await fetch('/api/create-room', {
              mode: 'no-cors',
              method: 'POST',
              body: JSON.stringify({
                title: 'LensShare-Space'
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
            onSendMessage(`lenshareapp.xyz/meet/${roomId}`);

            handleSend();

            // Instead of sending a message, set the meeting URL in the state

            // Instead of sending a message, set the meeting URL in the state
            setShow(true);
            setMeetingUrl(meetingUrl);
          }}
          className="text-brand-700 ml-16 inline h-8 w-8 cursor-pointer"
        />
        <div className="mx-4 mt-2 ">
          {show && currentProfile && (
            <Card className="mb-1 p-2 text-center">
              <Link href={meetingUrl}>
                <PhoneIcon className="text-brand-600 h-5 w-5" />
              </Link>
            </Card>
          )}
          {show && !currentProfile && (
            <Card className="mb-1 p-2 text-center">
              <Link href={meetingUrl}>
                <PhoneIcon className="h-5 w-5 text-emerald-600" />
              </Link>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
