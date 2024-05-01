
import type { ActionData, PublicationInfo } from 'nft-openaction-kit';
import type { Address } from 'viem';

import ActionInfo from '@components/Shared/Oembed/Nft/ActionInfo';

import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { NftOpenActionKit } from 'nft-openaction-kit';
import { type FC, useEffect, useRef, useState } from 'react';

import { useAccount } from 'wagmi';

import { OPEN_ACTION_EMBED_TOOLTIP, openActionCTA } from '.';
import DecentOpenActionModule from './Module';
import { AnyPublication, MirrorablePublication, UnknownOpenActionModuleSettings } from '@lensshare/lens';
import { Nft, OG } from '@lensshare/types/misc';
import { AllowedToken } from '@lensshare/types/hey';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import { VerifiedOpenActionModules } from '@lensshare/data/verified-openaction-modules';
import { HEY_REFERRAL_PROFILE_ID, ZERO_ADDRESS } from '@lensshare/data/constants';
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import { Button, Card, Spinner, Tooltip } from '@lensshare/ui';
import { PUBLICATION } from '@lensshare/data/tracking';
import DecentOpenActionShimmer from './Decent Open Action Shimmer';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import { useOaCurrency } from 'src/store/persisted/useOaCurrency';

interface DecentOpenActionProps {
  isFullPublication?: boolean;
  mirrorPublication?: AnyPublication;
  og: OG;
  openActionEmbed: boolean;
  openActionEmbedLoading: boolean;
  publication: AnyPublication;
}

function formatPublicationData(
  targetPublication: MirrorablePublication
): PublicationInfo {
  const [profileHex, pubHex] = targetPublication.id.split('-');

  const unknownModules =
    targetPublication.openActionModules as UnknownOpenActionModuleSettings[];
  const actionModules = unknownModules.map(
    (module) => module.contract.address
  ) as string[];
  const actionModulesInitDatas = unknownModules.map(
    (module) => module.initializeCalldata
  ) as string[];

  return {
    actionModules,
    actionModulesInitDatas,
    profileId: parseInt(profileHex, 16).toString(),
    pubId: parseInt(pubHex, 16).toString()
  };
}

const FeedEmbed: FC<DecentOpenActionProps> = ({
  mirrorPublication,
  og,
  openActionEmbed,
  openActionEmbedLoading,
  publication
}) => {
  const [actionData, setActionData] = useState<ActionData>();
  const [showOpenActionModal, setShowOpenActionModal] = useState(false);
  const { selectedCurrency } = useOaCurrency();
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const module = targetPublication.openActionModules.find(
    (module) => module.contract.address === VerifiedOpenActionModules.DecentNFT
  );

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { address } = useAccount();

  const prevCurrencyRef = useRef(selectedCurrency);

  const nft: Nft = {
    chain: actionData?.uiData.dstChainId.toString() ?? og.nft?.chain ?? null,
    collectionName: actionData?.uiData.nftName ?? og.nft?.collectionName ?? '',
    contractAddress: og.nft?.contractAddress ?? ZERO_ADDRESS,
    creatorAddress: (actionData?.uiData.nftCreatorAddress ??
      og.nft?.creatorAddress ??
      ZERO_ADDRESS) as `0x${string}`,
    description: og.description || '',
    endTime: null,
    mediaUrl:
      sanitizeDStorageUrl(actionData?.uiData.nftUri) ??
      og.nft?.mediaUrl ??
      og.image ??
      '',
    mintCount: og.nft?.mintCount ?? null,
    mintStatus: og.nft?.mintStatus ?? null,
    mintUrl: og.nft?.mintUrl ?? null,
    schema: actionData?.uiData.tokenStandard ?? og.nft?.schema ?? '',
    sourceUrl: og.url
  };

  const [loadingCurrency, setLoadingCurrency] = useState(false);
  const NEXT_PUBLIC_DECENT_API_KEY="4d019b3d2209196b20dd207f8c19c8a9"
  const NEXT_PUBLIC_OPENSEA_API_KEY="ee7460014fda4f58804f25c29a27df35"
  const NEXT_PUBLIC_RARIBLE_API_KEY="4ad887e1-fe57-47e9-b078-9c35f37c4c13"
  useEffect(
    () => {
      const actionDataFromPost = async () => {
        setLoadingCurrency(true);
        const nftOpenActionKit = new NftOpenActionKit({
          decentApiKey: NEXT_PUBLIC_DECENT_API_KEY || '',
          openSeaApiKey: NEXT_PUBLIC_OPENSEA_API_KEY || '',
          raribleApiKey: NEXT_PUBLIC_RARIBLE_API_KEY || ''
        });

        const addressParameter = address ? address : ZERO_ADDRESS;

        // Call the async function and pass the link
        try {
          const pubInfo = formatPublicationData(targetPublication);
          const actionDataResult: ActionData =
            await nftOpenActionKit.actionDataFromPost({
              executingClientProfileId: HEY_REFERRAL_PROFILE_ID,
              mirrorerProfileId: !!mirrorPublication
                ? mirrorPublication.by.id
                : undefined,
              mirrorPubId: !!mirrorPublication
                ? mirrorPublication.id
                : undefined,
              paymentToken: selectedCurrency.contractAddress,
              post: pubInfo,
              profileId: targetPublication.by.id,
              profileOwnerAddress: targetPublication.by.ownedBy.address,
              quantity: selectedQuantity !== 1 ? selectedQuantity : 1,
              senderAddress: addressParameter as Address,
              srcChainId: '137' // srcChainId, only supported on Polygon POS for now
            });
          setLoadingCurrency(false);
          if (actionDataResult) {
            setActionData(actionDataResult);
          }
        } catch (error) {
          errorToast(error);
          setLoadingCurrency(false);
        }
      };

      const isCurrencyChanged =
        prevCurrencyRef.current.contractAddress !==
        selectedCurrency.contractAddress;
      if ((module && !actionData) || isCurrencyChanged) {
        actionDataFromPost();
        prevCurrencyRef.current = selectedCurrency;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, module, targetPublication, selectedQuantity, selectedCurrency]
  );

  if (!module) {
    return null;
  }

  return (
    <>
      <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
        <div className="relative">
          <img
            alt={nft.mediaUrl !== '' ? nft.collectionName : undefined}
            className="h-[350px] max-h-[350px] w-full rounded-t-xl object-contain"
            src={nft.mediaUrl !== '' ? nft.mediaUrl : undefined}
          />
        </div>
        {!!actionData && nft ? (
          <div className="flex flex-col items-start justify-between gap-4 border-t p-4 sm:flex-row sm:items-center sm:gap-0 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              {nft.creatorAddress ? (
                <ActionInfo
                  actionData={actionData}
                  collectionName={nft.collectionName}
                  creatorAddress={nft.creatorAddress}
                  uiData={actionData.uiData}
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
                  <Button
                  className="w-full text-base font-normal sm:w-auto"
                  size="lg"
                >
                {openActionCTA(actionData.uiData.platformName)}
                </Button>
              </Tooltip>
            ) : (
              <Button
              className="w-full text-base font-normal sm:w-auto"
                onClick={() => {
                  setShowOpenActionModal(true);
                  Leafwatch.track(PUBLICATION.OPEN_ACTIONS.DECENT.OPEN_DECENT, {
                    publication_id: publication.id
                  });
                }}
                size="lg"
              >
                {openActionCTA(actionData.uiData.platformName)}
              </Button>
            )}
          </div>
        ) : (
          <DecentOpenActionShimmer />
        )}
      </Card>
      <DecentOpenActionModule
        actionData={actionData}
        loadingCurrency={loadingCurrency}
        module={module as UnknownOpenActionModuleSettings}
        nft={nft}
        onClose={() => setShowOpenActionModal(false)}
        publication={targetPublication}

        selectedQuantity={selectedQuantity}
    
        setSelectedQuantity={setSelectedQuantity}
        show={showOpenActionModal}
      />
    </>
  );
};

export default FeedEmbed;
