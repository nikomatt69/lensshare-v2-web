import Video from '@components/Shared/Video';
import {
  CursorArrowRaysIcon,
  SignalIcon,
  SignalSlashIcon
} from '@heroicons/react/24/outline';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import { PUBLICATION } from '@lensshare/data/tracking';
import type { AnyPublication } from '@lensshare/lens';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import type { UnlonelyChannelMetadata } from '@lensshare/types/nft';
import { Button, Card, Tooltip } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import type { FC } from 'react';
import useUnlonelyChannel from 'src/hooks/unlonely/useUnlonelyChannel';
import urlcat from 'urlcat';

import NftShimmer from './Shimmer';

interface UnlonelyChannelProps {
  nftMetadata: UnlonelyChannelMetadata;
  publication: AnyPublication;
}

const UnlonelyChannel: FC<UnlonelyChannelProps> = ({
  nftMetadata,
  publication
}) => {
  const { slug } = nftMetadata;

  const {
    data: channel,
    loading,
    error
  } = useUnlonelyChannel({
    slug,
    enabled: Boolean(slug)
  });

  if (loading) {
    return <NftShimmer />;
  }

  if (!channel) {
    return null;
  }

  if (error) {
    return null;
  }

  const { name, playbackUrl, isLive } = channel;

  return (
    <Card
      className="mt-3"
      forceRounded
      onClick={(event) => stopEventPropagation(event)}
    >
      <Video
        src={playbackUrl}
        className="[&>div>div]:rounded-b-none [&>div>div]:border-0"
      />
      <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-700">
        <div className="mr-5 flex flex-wrap items-center gap-2">
          <Tooltip placement="right" content="Unlonely Channel">
            <img
              src={`${STATIC_ASSETS_URL}/brands/unlonely.png`}
              className="h-5 w-5 rounded-full"
            />
          </Tooltip>
          <div className="text-sm font-bold">{name}</div>
          <div
            className={cn(
              isLive ? 'bg-red-500' : 'bg-gray-500',
              'flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-white'
            )}
          >
            {isLive ? (
              <SignalIcon className="h-3 w-3 animate-pulse" />
            ) : (
              <SignalSlashIcon className="h-3 w-3" />
            )}
            <span>{isLive ? 'Live' : 'Offline'}</span>
          </div>
        </div>
        <Link
          href={urlcat('https://www.unlonely.app/channels/:slug', {
            slug: channel.slug
          })}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            className="text-sm"
            icon={<CursorArrowRaysIcon className="h-4 w-4" />}
            size="md"
  
          >
            Open
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default UnlonelyChannel;
