import CopyOutline from '@components/Icons/CopyOutline';
import ShareOutline from '@components/Icons/ShareOutline';
import { ClockIcon } from '@heroicons/react/24/outline';
import { APP_NAME, LENSSHARE_EMBED_URL } from '@lensshare/data/constants';
import { Tooltip } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { useCopyToClipboard } from '@lib/useCopyToClipboard';
import { Card, Dialog, Flex, IconButton } from '@radix-ui/themes';

import type { FC } from 'react';
import React from 'react';

type Props = {
  publicationId: string;
  isAudio: boolean;
};

const EmbedMedia: FC<Props> = ({ publicationId, isAudio }) => {
  const [copy] = useCopyToClipboard();

  let iframeCode = `<iframe width="560" height="315" src="${LENSSHARE_EMBED_URL}/${publicationId}?autoplay=1&t=0&loop=0" title="${APP_NAME} player" frameborder="0" allow="accelerometer; autoplay; clipboard-write;" allowfullscreen></iframe>`;

  if (isAudio) {
    iframeCode = `<iframe width="100%" height="300" src="${LENSSHARE_EMBED_URL}/${publicationId}" title="${APP_NAME} player" frameborder="0"></iframe>`;
  }

  const onCopyCode = () => {
    copy(iframeCode);
  };

  const openModal = () => {};

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button
          type="button"
          onClick={() => openModal()}
          className="ml-5 flex rounded-full text-sm"
        >
          <ShareOutline className="mr-2 h-5 w-5" /> Embed
        </button>
      </Dialog.Trigger>

      <Dialog.Content className="z-10000" style={{ maxWidth: 650 }}>
        <Flex justify="between" pb="5" align="center">
          <Dialog.Title mb="0">Embed Media</Dialog.Title>
          <Dialog.Close>
            <IconButton variant="ghost" color="gray">
              <ClockIcon className="size-3" />
            </IconButton>
          </Dialog.Close>
        </Flex>

        <div className="z-[10000] flex flex-col space-y-3">
          <div className="z-[10000]  w-full">
            <iframe
              sandbox="allow-scripts z-[10000] allow-same-origin"
              className={cn(
                'w-full',
                isAudio ? 'min-h-[200px]' : 'aspect-[16/9] '
              )}
              src={`${LENSSHARE_EMBED_URL}/${publicationId}`}
              title={`${APP_NAME} player`}
              allow="accelerometer; autoplay; clipboard-write; gyroscope;"
              allowFullScreen
            />
          </div>
          <Flex>
            <Card className="relative ">
              <code className="select-all text-sm opacity-60">
                {iframeCode}
              </code>
              <Tooltip content="Copy Code" placement="top">
                <IconButton
                  type="button"
                  size="1"
                  variant="soft"
                  onClick={() => onCopyCode()}
                  className="absolute right-2 top-2"
                >
                  <CopyOutline className="size-4" />
                </IconButton>
              </Tooltip>
            </Card>
          </Flex>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EmbedMedia;
