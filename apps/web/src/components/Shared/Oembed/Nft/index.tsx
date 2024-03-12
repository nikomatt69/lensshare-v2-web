import type { FC } from 'react';

import { VerifiedOpenActionModules } from '@lensshare/data/verified-openaction-modules';
import { type AnyPublication, useProfileQuery } from '@lensshare/lens';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import truncateByWords from '@lensshare/lib/truncateByWords';
import { Nft } from '@lensshare/types/misc';
import { Button, Card, Spinner, Tooltip } from '@lensshare/ui';
import DecentOpenAction from '@components/Publication/LensOpenActions/Decent 2';
import MintedBy from './MintedBy';

// TODO: change copy
const OPEN_ACTION_EMBED_TOOLTIP = 'This is an open action';

interface NftProps {
  nft: Nft;
  openActionEmbed?: boolean;
  openActionEmbedLoading?: boolean;
  publication?: AnyPublication;
}

const Nft: FC<NftProps> = ({
  nft,
  openActionEmbed,
  openActionEmbedLoading,
  publication
}) => {
  const targetPublication =
    publication && isMirrorPublication(publication)
      ? publication.mirrorOn
      : publication;

  // Check if the publication has an NFT minting open action module
  const canPerformDecentAction =
    (targetPublication &&
      targetPublication?.openActionModules?.some(
        (module) =>
          module.contract.address === VerifiedOpenActionModules.DecentNFT
      )) ||
    false;

  const { data: creatorData } = useProfileQuery({
    skip: !nft.creatorAddress,
    variables: { request: { forProfileId: nft.creatorAddress } }
  });

  if (canPerformDecentAction) {
    return (
      <DecentOpenAction
        nft={nft}
        publication={targetPublication as AnyPublication}
      />
    );
  }

  return (
    <Card className="mt-3  w-full " forceRounded onClick={stopEventPropagation}>
      <div className="relative">
        <img
          alt={nft.collectionName}
          className="object-fit   h-[full] w-full rounded-t-xl "
          src={nft.mediaUrl}
        />
        {nft.creatorAddress ? <MintedBy address={nft.creatorAddress} /> : null}
      </div>
      <div className="flex items-center justify-between border-t p-2 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {nft.creatorAddress ? (
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-start justify-center">
                {/* <ImageData
                  alt={nft.collectionName}
                  className="size-6 rounded-full border bg-gray-200 dark:border-gray-700"
                  height={24}
                  loading="lazy"
                  // TODO: manage on platform image onError
                  src={nft.}
                  width={24}
                /> */}
              </div>
              <div className="flex flex-col items-start gap-0 text-sm">
                <span className="block sm:inline-flex sm:gap-2">
                  <h2 className="sm:hidden">
                    {truncateByWords(nft.collectionName, 3)}
                  </h2>
                  <h2 className="hidden sm:block">
                    {truncateByWords(nft.collectionName, 5)}
                  </h2>
                </span>
              </div>
            </div>
          ) : null}
        </div>
        {openActionEmbedLoading ? (
          <Spinner size="xs" />
        ) : openActionEmbed === true ? (
          <Tooltip
            content={<span>{OPEN_ACTION_EMBED_TOOLTIP}</span>}
            placement="top"
          >
            <Button>Mint</Button>
          </Tooltip>
        ) : null}
      </div>
    </Card>
  );
};

export default Nft;
