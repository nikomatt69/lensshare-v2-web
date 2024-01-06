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
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import cn from '@lensshare/ui/cn';
import { Menu } from '@headlessui/react';


type Props = {
  publication: MirrorablePublication;
};

const ShareE: FC<Props> = ({ publication }) => {
  const [copy] = useCopyToClipboard();
  const { resolvedTheme } = useTheme();
  const isAudio = publication.metadata?.__typename === 'AudioMetadataV3';
  const url = `${BASE_URL}/${isAudio ? 'listen' : 'posts'}/${publication.id}`;

  const onCopyVideoUrl = async () => {
    await copy(url);
  };

  return (
  
<Menu.Item
      as="div"
      className={({ active }) =>
        cn(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm'
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
      }}
    >
      <div className="flex items-center space-x-2">
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
    </Menu.Item>
  );
};

export default ShareE;
