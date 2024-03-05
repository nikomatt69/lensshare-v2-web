import CopyOutline from '@components/Icons/CopyOutline';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import { APP_NAME, LENSSHARE_EMBED_URL } from '@lensshare/data/constants';
import { Modal, Tooltip } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { useCopyToClipboard } from '@lib/useCopyToClipboard';
import { Card, IconButton } from '@radix-ui/themes';

import type { FC } from 'react';
import React, { useState } from 'react';

type Props = {
  publicationId: string;
};

const EmbedMedia: FC<Props> = ({ publicationId }) => {
  const [copy] = useCopyToClipboard();

  let iframeCode = `<iframe width="560" height="315" src="${LENSSHARE_EMBED_URL}/${publicationId}?autoplay=1&t=0&loop=0" title="${APP_NAME} player" frameborder="0" allow="accelerometer; autoplay; clipboard-write;" allowfullscreen></iframe>`;

  const onCopyCode = () => {
    copy(iframeCode);
  };

  const openModal = () => {};
  const [show, setShow] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setShow(true)}
        className=" lt-text-gray-500 flex rounded-full text-sm"
      >
        <CodeBracketIcon className="lt-text-gray-500 mr-2 h-4 w-4" />
      </button>
      <Modal
        title="Embed Media"
        icon={<CodeBracketIcon className="text-brand h-4 w-4" />}
        show={show}
        onClose={() => setShow(false)}
      >
        <Card className="rounded-xl border-0 p-3">
          <div className=" w-full rounded-xl border-0">
            <iframe
              sandbox="allow-scripts strict-origin"
              className={cn('w-full', 'aspect-[16/9] rounded-xl')}
              src={`${LENSSHARE_EMBED_URL}/${publicationId}`}
              title={`${APP_NAME} player`}
              allow="accelerometer; autoplay; clipboard-write; gyroscope;"
              allowFullScreen
            />
          </div>

          <Card className="relative rounded-xl border-0 ">
            <code className="select-all rounded-xl p-2 text-sm opacity-60">
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
                <CopyOutline className="h-4 w-4" />
              </IconButton>
            </Tooltip>
          </Card>
        </Card>
      </Modal>
    </>
  );
};

export default EmbedMedia;
