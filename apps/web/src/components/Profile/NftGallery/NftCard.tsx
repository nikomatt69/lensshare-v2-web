import { PLACEHOLDER_IMAGE } from '@lensshare/data/constants';
import type { Nft } from '@lensshare/lens';
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import Link from 'next/link';
import type { FC } from 'react';
import { memo } from 'react';

interface NFTProps {
  nft: Nft;
  linkToDetail?: boolean;
}

const NFTImage: FC<NFTProps> = ({ nft }) => {
  return nft?.metadata?.animationUrl ? (
    <div className="h-64 rounded-xl bg-gray-200 object-cover dark:bg-gray-800">
      {nft?.metadata?.animationUrl?.includes('.gltf') ? (
        <div
          style={{
            backgroundImage: `url(${`${PLACEHOLDER_IMAGE}`})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      ) : (
        <iframe
          title={`${nft.contract.address}:${nft.tokenId}`}
          sandbox=""
          className="h-full w-full rounded-xl bg-gray-200 object-cover dark:bg-gray-800"
          src={sanitizeDStorageUrl(nft?.metadata?.animationUrl)}
        />
      )}
    </div>
  ) : (
    <div
      className="h-64 rounded-xl bg-gray-200 object-cover dark:bg-gray-800"
      style={{
        backgroundImage: `url(${
          nft.metadata.image?.optimized?.uri
            ? sanitizeDStorageUrl(nft.metadata.image?.optimized?.uri)
            : PLACEHOLDER_IMAGE
        })`,
        backgroundSize: 'contain',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      }}
    />
  );
};

const NftCard: FC<NFTProps> = ({ nft, linkToDetail = false }) => {
  return linkToDetail ? (
    <Link
      href={`/nft/${nft.contract.chainId}/${nft.contract.address}/${nft.tokenId}`}
      className="w-full"
    >
      <NFTImage nft={nft} />
    </Link>
  ) : (
    <div className="w-full">
      <NFTImage nft={nft} />
    </div>
  );
};

export default memo(NftCard);
