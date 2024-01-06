import { IconButton } from '@radix-ui/themes';

import { useTheme } from 'next-themes';
import type { FC } from 'react';
import React from 'react';
import type { MirrorablePublication } from '@lensshare/lens';

import { BASE_URL } from '@lensshare/data/constants';
import { Tooltip } from '@lensshare/ui';
import CopyOutline from '@components/Icons/CopyOutline';
import { useCopyToClipboard } from '@lib/useCopyToClipboard';
import EmbedMedia from '@components/Publication/EmbedMedia';

type Props = {
  publication: MirrorablePublication;
};

const Share: FC<Props> = ({ publication }) => {
  const [copy] = useCopyToClipboard();
  const { resolvedTheme } = useTheme();
  const isAudio = publication.metadata?.__typename === 'AudioMetadataV3';
  const url = `${BASE_URL}/${isAudio ? 'listen' : 'posts'}/${publication.id}`;

  const onCopyVideoUrl = async () => {
    await copy(url);
  };

  return (
    <div>
      <div className="no-scrollbar z-[5] mb-4 flex flex-nowrap items-center space-x-3 overflow-x-auto">
        <EmbedMedia publicationId={publication.id} isAudio={isAudio} />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-gray-200 p-2 dark:border-gray-800">
        <div className="select-all truncate text-sm">{url}</div>
        <Tooltip content="Copy" placement="top">
          <IconButton
            variant="soft"
            size="1"
            className="ml-2 hover:opacity-60 focus:outline-none"
            onClick={() => onCopyVideoUrl()}
          >
            <CopyOutline className="size-4" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default Share;
