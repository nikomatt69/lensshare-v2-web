import type { AnyPublication } from '@lensshare/lens';

import type {
  BasePaintCanvasMetadata,
  BasicNftMetadata,
  SoundReleaseMetadata,
  UnlonelyChannelMetadata,
  UnlonelyNfcMetadata
} from '@lensshare/types/nft';
import type { FC } from 'react';

import BasePaintCanvas from './BasePaintCanvas';
import UnlonelyChannel from './UnlonelyChannel';
import UnlonelyNfc from './UnlonelyNfc';
import ZoraNft from './ZoraNft';
import SoundRelease from './SoundRelease';
import getNft from 'src/utils/oembed/meta/getNft';

interface NftProps {
  url: string;
  publication: AnyPublication;
}

type NftMetadata =
  | BasicNftMetadata
  | BasePaintCanvasMetadata
  | SoundReleaseMetadata
  | UnlonelyChannelMetadata
  | UnlonelyNfcMetadata;

const Nft: FC<NftProps> = ({ url, publication }) => {
  const nftMetadataResult = getNft(document, url);

  if (!nftMetadataResult) {
    return null;
  }

  const nftMetadata = nftMetadataResult as unknown as NftMetadata;

  function determineProvider(nftMetadata: NftMetadata): string {
    if ('basePaintField' in nftMetadata) {
      return 'basepaint';
    } else if ('zoraField' in nftMetadata) {
      return 'zora';
    } else if ('unlonelyChannelField' in nftMetadata) {
      return 'unlonely-channel';
    } else if ('unlonelyNfcField' in nftMetadata) {
      return 'unlonely-nfc';
    } else if ('soundReleaseField' in nftMetadata) {
      return 'sound-release';
    }
    return ''; // Default case if none of the conditions match
  }
  // Assuming there's a way to determine the provider from the metadata or URL, which is missing in the provided context
  const provider = determineProvider(nftMetadata); // This function needs to be implemented based on how you can determine the provider

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
  ) : provider === 'sound-release' ? (
    <SoundRelease
      nftMetadata={nftMetadata as SoundReleaseMetadata}
      publication={publication}
    />
  ) : null;
};
export default Nft;