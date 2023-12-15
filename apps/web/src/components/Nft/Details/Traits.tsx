import type { OpenSeaNft } from '@lensshare/types/opensea-nft';
import { Card } from '@lensshare/ui';
import type { FC } from 'react';

interface NftTraitsProps {
  nft: OpenSeaNft;
}

const NftTraits: FC<NftTraitsProps> = ({ nft }) => {
  if (!nft.traits?.length) {
    return null;
  }

  return (
    <Card>
      <h1 className="divider px-5 py-4 font-bold">Traits</h1>
      <p className="flex flex-wrap gap-2 p-5">
        {nft.traits.map((trait, index) => (
          <div key={index} className="rounded-lg border px-3 py-1 text-center">
            <div className="lt-text-gray-500 text-xs">{trait.trait_type}</div>
            <div className="text-sm font-bold">{trait.value}</div>
          </div>
        ))}
      </p>
    </Card>
  );
};

export default NftTraits;
