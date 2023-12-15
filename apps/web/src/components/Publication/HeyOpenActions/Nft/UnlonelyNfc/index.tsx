import Video from '@components/Shared/Video';
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import { PUBLICATION } from '@lensshare/data/tracking';
import type { AnyPublication } from '@lensshare/lens';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import type { UnlonelyNfcMetadata } from '@lensshare/types/nft';
import { Button, Card, Tooltip } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import type { FC } from 'react';
import useUnlonelyNfc from 'src/hooks/unlonely/useUnlonelyNfc';
import urlcat from 'urlcat';

import NftShimmer from './Shimmer';

interface UnlonelyNfcProps {
  nftMetadata: UnlonelyNfcMetadata;
  publication: AnyPublication;
}

const UnlonelyNfc: FC<UnlonelyNfcProps> = ({ nftMetadata, publication }) => {
  const { id } = nftMetadata;

  const {
    data: nfc,
    loading,
    error
  } = useUnlonelyNfc({
    id,
    enabled: Boolean(id)
  });

  if (loading) {
    return <NftShimmer />;
  }

  if (!nfc) {
    return null;
  }

  if (error) {
    return null;
  }

  const { title, videoLink, videoThumbnail } = nfc;

  return (
    <Card
      className="mt-3"
      forceRounded
      onClick={(event) => stopEventPropagation(event)}
    >
      <Video
        src={videoLink}
        poster={videoThumbnail}
        className="[&>div>div]:rounded-b-none [&>div>div]:border-0"
      />
      <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-700">
        <div className="mr-5 flex flex-wrap items-center gap-2">
          <Tooltip placement="right" content="Unlonely Nfc">
            <img
              src={`${STATIC_ASSETS_URL}/brands/unlonely.png`}
              className="h-5 w-5 rounded-full"
            />
          </Tooltip>
          <div className="text-sm font-bold">{title}</div>
        </div>
        <Link
          href={urlcat('https://www.unlonely.app/nfc/:id', {
            id: nfc.id
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

export default UnlonelyNfc;
