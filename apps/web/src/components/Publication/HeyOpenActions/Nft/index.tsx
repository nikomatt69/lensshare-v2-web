import type { AnyPublication } from '@lensshare/lens';
import getNft from '@lensshare/lib/nft/getNft';
import type {
  BasePaintCanvasMetadata,
  BasicNftMetadata,
  UnlonelyChannelMetadata,
  UnlonelyNfcMetadata
} from '@lensshare/types/nft';
import type { FC } from 'react';

import BasePaintCanvas from './BasePaintCanvas';
import UnlonelyChannel from './UnlonelyChannel';
import UnlonelyNfc from './UnlonelyNfc';
import ZoraNft from './ZoraNft';

interface NftProps {
  mintLink: string;
  publication: AnyPublication;
}

const Nft: FC<NftProps> = ({ mintLink, publication }) => {
  const nftMetadata = getNft([mintLink]);

  if (!nftMetadata) {
    return null;
  }

  const { provider } = nftMetadata;

  return provider === 'zora' ? (
    <ZoraNft
      nftMetadata={nftMetadata as BasicNftMetadata}
      publication={publication}
    />
  ) : provider === 'basepaint' ? (
    <BasePaintCanvas
      nftMetadata={nftMetadata as BasePaintCanvasMetadata}
      publication={publication}
    />
  ) : provider === 'unlonely-channel' ? (
    <UnlonelyChannel
      nftMetadata={nftMetadata as UnlonelyChannelMetadata}
      publication={publication}
    />
  ) : provider === 'unlonely-nfc' ? (
    <UnlonelyNfc
      nftMetadata={nftMetadata as UnlonelyNfcMetadata}
      publication={publication}
    />
  ) : null;
};

export default Nft;
