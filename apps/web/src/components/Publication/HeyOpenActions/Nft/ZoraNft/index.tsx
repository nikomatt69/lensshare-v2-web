import {
  CursorArrowRaysIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';
import { PUBLICATION } from '@lensshare/data/tracking';
import type { AnyPublication } from '@lensshare/lens';
import getZoraChainInfo from '@lensshare/lib/getZoraChainInfo';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import type { BasicNftMetadata } from '@lensshare/types/nft';
import { Button, Card, Modal, Tooltip } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import type { FC } from 'react';
import { useState } from 'react';
import useZoraNft from 'src/hooks/zora/useZoraNft';
import urlcat from 'urlcat';

import Mint, { useZoraMintStore } from './Mint';
import NftShimmer from './Shimmer';

interface ZoraNftProps {
  nftMetadata: BasicNftMetadata;
  publication: AnyPublication;
}

const ZoraNft: FC<ZoraNftProps> = ({ nftMetadata, publication }) => {
  const { chain, address, token } = nftMetadata;
  const [showMintModal, setShowMintModal] = useState(false);
  const { setQuantity, setCanMintOnHey } = useZoraMintStore();

  const {
    data: nft,
    loading,
    error
  } = useZoraNft({
    chain,
    address,
    token: token,
    enabled: Boolean(chain && address)
  });

  if (loading) {
    return <NftShimmer />;
  }

  if (!nft) {
    return null;
  }

  if (error) {
    return null;
  }

  const canMint = [
    'ERC721_DROP',
    'ERC721_SINGLE_EDITION',
    'ERC1155_COLLECTION_TOKEN'
  ].includes(nft.contractType);

  const zoraLink = nftMetadata.mintLink;

  return (
    <Card
      className="mt-3"
      forceRounded
      onClick={(event) => stopEventPropagation(event)}
    >
      <img
        src={urlcat('https://remote-image.decentralized-content.com/image', {
          url: nft.coverImageUrl,
          w: 1200,
          q: 75
        })}
        className="h-[400px] max-h-[400px] w-full rounded-t-xl object-cover"
      />
      <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Tooltip
            placement="right"
            content={getZoraChainInfo(nft.chainId).name}
          >
            <img src={getZoraChainInfo(nft.chainId).logo} className="h-5 w-5" />
          </Tooltip>
          <div className="text-sm font-bold">{nft.name}</div>
          {nft.contractType === 'ERC1155_COLLECTION' ? (
            <Tooltip placement="right" content="ERC-1155 Collection">
              <RectangleStackIcon className="h-4 w-4" />
            </Tooltip>
          ) : null}
        </div>
        {canMint ? (
          <>
            <Button
              className="text-sm"
              icon={<CursorArrowRaysIcon className="h-4 w-4" />}
              size="md"
              onClick={() => {
                setQuantity(1);
                setCanMintOnHey(false);
                setShowMintModal(true);
              
              }}
            >
              Mint
            </Button>
            <Modal
              title="Mint on Zora"
              show={showMintModal}
              icon={<CursorArrowRaysIcon className="text-brand h-5 w-5" />}
              onClose={() => setShowMintModal(false)}
            >
              <Mint nft={nft} zoraLink={zoraLink} publication={publication} />
            </Modal>
          </>
        ) : (
          <Link href={zoraLink} target="_blank" rel="noopener noreferrer">
            <Button
              className="text-sm"
              icon={<CursorArrowRaysIcon className="h-4 w-4" />}
              size="md"
             
            >
              {nft.contractType === 'ERC1155_COLLECTION'
                ? 'Mint all on Zora'
                : 'Mint on Zora'}
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
};

export default ZoraNft;
