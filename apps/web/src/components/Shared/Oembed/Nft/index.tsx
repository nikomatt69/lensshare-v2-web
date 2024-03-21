import type { FC } from 'react';
import type { Nft as INft } from '@lensshare/types/misc';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';

import { Button, Card, Tooltip } from '@lensshare/ui';

import MintedBy from './MintedBy';
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import getNftChainInfo from '@lensshare/lib/getNftChainInfo';

// TODO: change copy
interface NftProps {
  nft: INft;
  publicationId?: string;
}

const Nft: FC<NftProps> = ({ nft, publicationId }) => {
  return (
    <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
      <div className="relative">
        <img
          alt={nft.collectionName}
          className="h-[350px] max-h-[350px] w-full rounded-t-xl object-cover"
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
                className="h-5 w-5"
                src={getNftChainInfo(nft.chain).logo}
              />
            </Tooltip>
          ) : null}
          <div className="text-sm font-bold">{nft.collectionName}</div>
        </div>
        <Link href={nft.sourceUrl} rel="noopener noreferrer" target="_blank">
          <Button
            className="text-sm"
            icon={<CursorArrowRaysIcon className="h-4 w-4" />}
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
