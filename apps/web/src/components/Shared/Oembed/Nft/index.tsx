import type { FC } from 'react';

import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';

import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import { Nft } from '@lensshare/types/misc';
import { Button, Card, Tooltip } from '@lensshare/ui';
import Link from 'next/link';
import getNftChainInfo from '@lensshare/lib/getNftChainInfo';
import MintedBy from './MintedBy';

interface NftProps {
  nft: Nft;
  publicationId?: string;
}

const Nft: FC<NftProps> = ({ nft, publicationId }) => {
  return (
    <Card className="mt-3  w-full " forceRounded onClick={stopEventPropagation}>
      <div className="relative">
        <img
          alt={nft.collectionName}
          className="h-[350px] max-h-[350px]  w-full rounded-t-xl object-cover "
          src={nft.mediaUrl}
        />
        {nft.creatorAddress ? <MintedBy address={nft.creatorAddress} /> : null}
      </div>
      <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {nft.chain ? (
            <Tooltip
              content={getNftChainInfo(nft.chain).name}
              placement="right"
            >
              <img
                alt={getNftChainInfo(nft.chain).name}
                className="size-5"
                src={getNftChainInfo(nft.chain).logo}
              />
            </Tooltip>
          ) : null}
          <div className="text-sm font-bold">{nft.collectionName}</div>
        </div>
        <Link href={nft.sourceUrl} rel="noopener noreferrer" target="_blank">
          <Button
            className="text-sm"
            icon={<CursorArrowRaysIcon className="size-4" />}
            size="md"
          >
            Mint
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default Nft;
