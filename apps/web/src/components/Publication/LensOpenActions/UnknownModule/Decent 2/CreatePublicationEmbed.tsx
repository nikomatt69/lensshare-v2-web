
import type { UIData } from 'nft-openaction-kit';

import ActionInfo from '@components/Shared/Oembed/Nft/ActionInfo';

import errorToast from '@lib/errorToast';
import { NftOpenActionKit } from 'nft-openaction-kit';
import { type FC, useEffect, useState } from 'react';


import { Nft, OG } from '@lensshare/types/misc';
import { ZERO_ADDRESS } from '@lensshare/data/constants';
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import { Button, Card, Spinner, Tooltip } from '@lensshare/ui';
import DecentOpenActionShimmer from './Decent Open Action Shimmer';
import {
  OPEN_ACTION_EMBED_TOOLTIP,
  OPEN_ACTION_NO_EMBED_TOOLTIP,
  openActionCTA
} from '.';
interface CreatePublicationEmbedProps {
  og: OG;
  openActionEmbed: boolean;
  openActionEmbedLoading: boolean;
}

const CreatePublicationEmbed: FC<CreatePublicationEmbedProps> = ({
  og,
  openActionEmbed,
  openActionEmbedLoading
}) => {
  const [uiData, setUiData] = useState<UIData>();
  const NEXT_PUBLIC_DECENT_API_KEY="4d019b3d2209196b20dd207f8c19c8a9"
  const NEXT_PUBLIC_OPENSEA_API_KEY="ee7460014fda4f58804f25c29a27df35"
  const NEXT_PUBLIC_RARIBLE_API_KEY="4ad887e1-fe57-47e9-b078-9c35f37c4c13"
  useEffect(() => {
    const generateUiData = async () => {
      const nftOpenActionKit = new NftOpenActionKit({
        decentApiKey: NEXT_PUBLIC_DECENT_API_KEY || '',
        openSeaApiKey: NEXT_PUBLIC_OPENSEA_API_KEY || '',
        raribleApiKey: NEXT_PUBLIC_RARIBLE_API_KEY || ''
      });

      // Call the async function and pass the link
      try {
        const uiDataResult: UIData = await nftOpenActionKit.generateUiData({
          contentURI: og.url
        });

        if (uiDataResult) {
          setUiData(uiDataResult);
        }
      } catch (error) {
        errorToast(error);
      }
    };
    generateUiData();
  }, [og]);

  const nft: Nft = {
    chain: uiData?.dstChainId.toString() ?? og.nft?.chain ?? null,
    collectionName: uiData?.nftName ?? og.nft?.collectionName ?? '',
    contractAddress: og.nft?.contractAddress ?? ZERO_ADDRESS,
    creatorAddress: (uiData?.nftCreatorAddress ??
      og.nft?.creatorAddress ??
      ZERO_ADDRESS) as `0x${string}`,
    description: og.description || '',
    endTime: null,
    mediaUrl:
      sanitizeDStorageUrl(uiData?.nftUri) ?? og.nft?.mediaUrl ?? og.image ?? '',
    mintCount: og.nft?.mintCount ?? null,
    mintStatus: og.nft?.mintStatus ?? null,
    mintUrl: og.nft?.mintUrl ?? null,
    schema: uiData?.tokenStandard ?? og.nft?.schema ?? '',
    sourceUrl: og.url
  };

  return (
    <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
      <div className="relative">
        <img
          alt={nft.mediaUrl !== '' ? nft.collectionName : undefined}
          className="h-[350px] max-h-[350px] w-full rounded-t-xl object-cover"
          src={nft.mediaUrl !== '' ? nft.mediaUrl : undefined}
        />
      </div>
      {!!uiData && !!nft ? (
        <div className="flex items-center justify-between border-t p-4 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {uiData && nft.creatorAddress ? (
              <ActionInfo
                collectionName={nft.collectionName}
                creatorAddress={nft.creatorAddress}
                uiData={uiData}
              />
            ) : null}
          </div>

          {openActionEmbedLoading ? (
            <Spinner size="xs" />
          ) : openActionEmbed ? (
            <Tooltip
              content={<span>{OPEN_ACTION_EMBED_TOOLTIP}</span>}
              placement="top"
            >
              <Button className="text-base font-normal" size="lg">
              {openActionCTA(uiData.platformName)}
              </Button>
            </Tooltip>
          ) : (
            <Tooltip
              content={<span>{OPEN_ACTION_NO_EMBED_TOOLTIP}</span>}
              placement="top"
            >
              <Button
                className="text-base font-normal"
                disabled={true}
                size="lg"
              >
                {openActionCTA(uiData.platformName)}
              </Button>
            </Tooltip>
          )}
        </div>
      ) : (
        <DecentOpenActionShimmer />
      )}
    </Card>
  );
};

export default CreatePublicationEmbed;
