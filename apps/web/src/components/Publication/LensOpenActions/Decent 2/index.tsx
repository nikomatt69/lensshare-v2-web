import type {
  AnyPublication,
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@lensshare/lens';
import type { Nft } from '@lensshare/types/misc';
import type { ActionData, PublicationInfo } from 'nft-openaction-kit';

import ActionInfo from '@components/Shared/Oembed/Nft/ActionInfo';

import { PUBLICATION } from '@lensshare/data/tracking';
import { VerifiedOpenActionModules } from '@lensshare/data/verified-openaction-modules';
import getNftChainInfo from '@lensshare/lib/getNftChainInfo';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import { Button, Card, Tooltip } from '@lensshare/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { NftOpenActionKit } from 'nft-openaction-kit';
import { type FC, useEffect, useState, useRef } from 'react';
import { Address, useAccount } from 'wagmi';

import DecentOpenActionModule from './Module';
import DecentOpenActionShimmer from './Decent Open Action Shimmer';
import { DEFAULT_COLLECT_TOKEN } from '@lensshare/data/constants';
import type { AllowedToken } from '@lensshare/types/hey';

interface DecentOpenActionProps {
  isFullPublication?: boolean;
  nft: Nft;
  publication: AnyPublication;
}
interface ExtendedOpenActionModuleSettings
  extends UnknownOpenActionModuleSettings {
  initializeCalldata: string;
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
    (module) => (module as ExtendedOpenActionModuleSettings).initializeCalldata
  ) as string[];

  return {
    actionModules,
    actionModulesInitDatas,
    profileId: parseInt(profileHex, 16).toString(),
    pubId: parseInt(pubHex, 16).toString()
  };
}

const DecentOpenAction: FC<DecentOpenActionProps> = ({ nft, publication }) => {
  const [actionData, setActionData] = useState<ActionData>();
  const [showOpenActionModal, setShowOpenActionModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<AllowedToken>({
    contractAddress: DEFAULT_COLLECT_TOKEN,
    decimals: 18,
    id: 'WMATIC',
    name: 'Wrapped MATIC',
    symbol: 'WMATIC'
  });
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const module = targetPublication.openActionModules?.find(
    (module) => module.contract.address === VerifiedOpenActionModules.DecentNFT
  );

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { address } = useAccount();

  const prevCurrencyRef = useRef(selectedCurrency);

  useEffect(
    () => {
      const actionDataFromPost = async () => {
        const nftOpenActionKit = new NftOpenActionKit({
          decentApiKey: process.env.NEXT_PUBLIC_DECENT_API_KEY || '',
          openSeaApiKey: process.env.NEXT_PUBLIC_OPENSEA_API_KEY || '',
          raribleApiKey: process.env.NEXT_PUBLIC_RARIBLE_API_KEY || ''
        });

        const addressParameter = address
          ? address
          : '0x0000000000000000000000000000000000000000';

        // Call the async function and pass the link
        try {
          const pubInfo = formatPublicationData(targetPublication);
          const actionDataResult: ActionData =
            await nftOpenActionKit.actionDataFromPost(
              pubInfo,
              targetPublication.by.id,
              targetPublication.by.ownedBy.address,
              addressParameter as Address,
              '137', // srcChainId, only supported on Polygon POS for now
              selectedQuantity !== 1 ? BigInt(selectedQuantity) : 1n,
              selectedCurrency.contractAddress
            );
          if (actionDataResult) {
            setActionData(actionDataResult);
          }
        } catch (error) {
          errorToast(error);
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
    [
      address,
      module,
      targetPublication,
      selectedQuantity,
      selectedCurrency.contractAddress
    ]
  );

  if (!module) {
    return null;
  }

  return (
    <>
      <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
        <div className="relative">
          <img
            alt={nft.collectionName}
            className="h-[350px] max-h-[350px] w-full rounded-t-xl object-cover"
            src={nft.mediaUrl}
          />
        </div>
        {!!actionData && nft ? (
          <div className="flex items-center justify-between border-t p-4 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              {nft.chain ? (
                <Tooltip
                  content={getNftChainInfo(nft.chain).name}
                  placement="right"
                >
                  <img
                    alt={getNftChainInfo(nft.chain).name}
                    className="w-5 h-5"
                    src={getNftChainInfo(nft.chain).logo}
                  />
                </Tooltip>
              ) : null}
              {nft.creatorAddress ? (
                <ActionInfo
                  actionData={actionData}
                  collectionName={nft.collectionName}
                  creatorAddress={nft.creatorAddress}
                />
              ) : null}
            </div>
            <Button
              className="text-base font-normal"
              onClick={() => {
                setShowOpenActionModal(true);
                Leafwatch.track(PUBLICATION.OPEN_ACTIONS.DECENT.OPEN_DECENT, {
                  publication_id: publication.id
                });
              }}
              size="lg"
            >
              Mint
            </Button>
          </div>
        ) : (
          <DecentOpenActionShimmer />
        )}
      </Card>
      <DecentOpenActionModule
        actionData={actionData}
        module={module as UnknownOpenActionModuleSettings}
        nft={nft}
        onClose={() => setShowOpenActionModal(false)}
        publication={targetPublication}
        selectedCurrency={selectedCurrency}
        selectedQuantity={selectedQuantity}
        setSelectedCurrency={setSelectedCurrency}
        setSelectedQuantity={setSelectedQuantity}
        show={showOpenActionModal}
      />
    </>
  );
};

export default DecentOpenAction;
