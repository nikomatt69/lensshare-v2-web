import { IconButton } from '@radix-ui/themes';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import type { FC } from 'react';
import React from 'react';
import type { AnyPublication, MirrorablePublication, PrimaryPublication } from '@lensshare/lens';

import { BASE_URL, STATIC_ASSETS_URL } from '@lensshare/data/constants';
import { getSharableLink } from '@lib/getSharableLink';
import { imageCdn } from 'src/hooks/imageCdn';
import MirrorOutline from '@components/Icons/MirrorOutline';
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
      <div className="no-scrollbar mb-4 flex flex-nowrap items-center space-x-3 overflow-x-auto">
        <EmbedMedia publicationId={publication.id} isAudio={isAudio} />

        <div className="rounded-full bg-gray-200 p-3 dark:bg-gray-800">
          <MirrorOutline className="size-5" />
        </div>

        <Link
          className="rounded-full"
          target="_blank"
          rel="noreferrer"
          href={getSharableLink('hey', publication)}
        >
          <img
            src={imageCdn(
              `${STATIC_ASSETS_URL}/images/social/hey-logo.svg`,
              'AVATAR_LG'
            )}
            className="size-10 max-w-none"
            loading="eager"
            alt="hey"
            draggable={false}
          />
        </Link>
        <span className="middot" />
        <Link
          className="rounded-full"
          target="_blank"
          rel="noreferrer"
          href={getSharableLink('x', publication)}
        >
          <div className="rounded-full bg-gray-200 p-3 dark:bg-gray-800">
            {resolvedTheme === 'dark' ? (
              <img
                src={imageCdn(
                  `${STATIC_ASSETS_URL}/images/social/x-white.png`,
                  'AVATAR'
                )}
                className="size-4"
                height={16}
                width={16}
                alt="X Logo"
                draggable={false}
              />
            ) : (
              <img
                src={imageCdn(
                  `${STATIC_ASSETS_URL}/images/social/x-black.png`,
                  'AVATAR'
                )}
                className="size-4"
                height={16}
                width={16}
                alt="X Logo"
                draggable={false}
              />
            )}
          </div>
        </Link>
        <Link
          href={getSharableLink('reddit', publication)}
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={imageCdn(
              `${STATIC_ASSETS_URL}/images/social/reddit-logo.webp`,
              'AVATAR_LG'
            )}
            className="size-10 max-w-none rounded-full"
            loading="eager"
            alt="reddit"
            draggable={false}
          />
        </Link>
        <Link
          href={getSharableLink('linkedin', publication)}
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={imageCdn(
              `${STATIC_ASSETS_URL}/images/social/linkedin-logo.png`,
              'AVATAR_LG'
            )}
            loading="eager"
            alt="linkedin"
            className="size-10 max-w-none rounded-full"
            draggable={false}
          />
        </Link>
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
