import type {
  MirrorablePublication,
  Profile,
  UnknownOpenActionModuleSettings
} from '@lensshare/lens';
import type { Dispatch, FC, SetStateAction } from 'react';

import {
  useApprovedModuleAllowanceAmountQuery,
  useDefaultProfileQuery
} from '@lensshare/lens';
import { HelpTooltip, Modal } from '@lensshare/ui';
import { useEffect, useState } from 'react';
import {
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
  UserIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

import truncateByWords from '@lensshare/lib/truncateByWords';
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import getProfile from '@lensshare/lib/getProfile';
import CurrencySelector from './CurrencySelector';
import type { AllowedToken } from '@lensshare/types/hey';
import { VerifiedOpenActionModules } from '@lensshare/data/verified-openaction-modules';
import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';
import type { ActionData } from 'nft-openaction-kit';
import type { Nft } from '@lensshare/types/misc';
import getRedstonePrice from '@lib/getRedstonePrice';
import StepperApprovals from './Stepper Approvals';
import { CHAIN } from '@lib/costantChain';
import DecentAction from './DecentAction';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import { CHAIN_ID } from 'src/constants';
import getCurrentSession from '@lib/getCurrentSession';
const TOOLTIP_PRICE_HELP =
  'You don’t have enough native Zora ETH so we switched you to the next token with the lowest gas that you have enough of (lol)';
interface DecentOpenActionModuleProps {
  actionData?: ActionData;
  module: UnknownOpenActionModuleSettings;
  nft: Nft;
  onClose: () => void;
  publication: MirrorablePublication;
  selectedCurrency: AllowedToken;
  selectedQuantity: number;
  setSelectedCurrency: Dispatch<SetStateAction<AllowedToken>>;
  setSelectedQuantity: Dispatch<number>;
  show: boolean;
}

const DecentOpenActionModule: FC<DecentOpenActionModuleProps> = ({
  actionData,
  module,
  nft,
  onClose,
  publication,
  selectedCurrency,
  selectedQuantity,
  setSelectedCurrency,
  setSelectedQuantity,
  show
}) => {
  const [usdPrice, setUsdPrice] = useState(0);

  const getUsdPrice = async () => {
    const usdPrice = await getRedstonePrice('MATIC');
    setUsdPrice(usdPrice);
  };

  useEffect(() => {
    getUsdPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency]);

  const { actOnUnknownOpenAction, isLoading, relayStatus, txHash } =
    useActOnUnknownOpenAction({
      signlessApproved: module.signlessApproved,
      successToast: 'Initiated cross-chain NFT mint'
    });

  const act = async () => {
    if (actionData && publication) {
      await actOnUnknownOpenAction({
        address: VerifiedOpenActionModules.DecentNFT as `0x${string}`,
        data: actionData.actArguments.actionModuleData,
        publicationId: publication.id
      });
    }
  };

  const { data: creatorProfileData } = useDefaultProfileQuery({
    skip: !actionData?.uiData.nftCreatorAddress,
    variables: { request: { for: actionData?.uiData.nftCreatorAddress } }
  });

  const formattedPrice = (
    (actionData
      ? actionData.actArgumentsFormatted.paymentToken.amount /
        BigInt(10 ** selectedCurrency.decimals)
      : BigInt(0)) * BigInt(selectedQuantity)
  ).toString();
  const formattedTotalFees = (
    actionData
      ? actionData.actArgumentsFormatted.bridgeFee.amount /
        BigInt(10 ** selectedCurrency.decimals)
      : BigInt(0)
  ).toString();

  const formattedTotalPrice = (
    BigInt(formattedPrice) + BigInt(formattedTotalFees)
  ).toString();

  const formattedNftSchema = nft.schema === 'erc1155' ? 'ERC-1155' : 'ERC-721';

  const [showLongDescription, setShowLongDescription] = useState(false);
  const [showFees, setShowFees] = useState(false);

  const [showCurrencySelector, setShowCurrencySelector] = useState(false);

  const [isModalCollapsed, setIsModalCollapsed] = useState(false);

  // TODO: fetch permit2 allowance status and update with useEffect depending on currency
  const [permit2Allowed, setPermit2Allowed] = useState(false);

  const approvePermit2 = (token: AllowedToken) => {
    console.log(`${token} approved for permit2`);
    setPermit2Allowed(true);
  };

  const [allowed, setAllowed] = useState(true);
  const { id: sessionProfileId } = getCurrentSession();

  const amount = parseInt(formattedTotalPrice) || 0;
  const assetAddress = selectedCurrency.contractAddress;

  const { data: allowanceData, loading: allowanceLoading } =
    useApprovedModuleAllowanceAmountQuery({
      fetchPolicy: 'no-cache',
      onCompleted: ({ approvedModuleAllowanceAmount }) => {
        if (!amount) {
          return;
        }

        const allowedAmount = parseFloat(
          approvedModuleAllowanceAmount[0]?.allowance.value
        );
        setAllowed(allowedAmount > amount);
      },
      skip: !amount || !sessionProfileId || !assetAddress,
      variables: {
        request: {
          currencies: [assetAddress],
          unknownOpenActionModules: [module.contract.address]
        }
      }
    });

  return (
    <Modal
      icon={
        showCurrencySelector ? (
          <button onClick={() => setShowCurrencySelector(false)}>
            <ChevronLeftIcon className="mt-[2px] w-4" strokeWidth={3} />
          </button>
        ) : isModalCollapsed ? (
          <button onClick={() => setIsModalCollapsed(false)}>
            <ChevronLeftIcon className="mt-[2px] w-4" strokeWidth={3} />
          </button>
        ) : null
      }
      onClose={() => {
        setIsModalCollapsed(false);
        onClose();
      }}
      show={show}
      title={
        showCurrencySelector
          ? 'Select token'
          : actionData?.uiData.platformName
          ? `Mint on ${actionData?.uiData.platformName}`
          : 'Mint NFT'
      }
    >
      {showCurrencySelector ? (
        <CurrencySelector
          onSelectCurrency={(currency) => {
            setSelectedCurrency(currency);
            setShowCurrencySelector(false);
          }}
        />
      ) : isModalCollapsed ? (
        <StepperApprovals
          allowanceData={allowanceData}
          approvePermit2={() => approvePermit2(selectedCurrency)}
          nftDetails={{
            creator: getProfile(creatorProfileData?.defaultProfile as Profile)
              .slug,
            name: actionData?.uiData.nftName ?? '',
            price: formattedTotalPrice + selectedCurrency.symbol,
            schema: formattedNftSchema,
            uri: sanitizeDStorageUrl(actionData?.uiData.nftUri)
          }}
          selectedCurrencySymbol={selectedCurrency.symbol}
          setAllowed={setAllowed}
          step={!permit2Allowed ? 'Permit2' : 'Allowance'}
        />
      ) : (
        <>
          <div className="space-y-2 p-5">
            <div>
              <h2 className="text-xl">{actionData?.uiData.nftName}</h2>
              {creatorProfileData ? (
                <p className="text-black/50">
                  by
                  {
                    getProfile(creatorProfileData?.defaultProfile as Profile)
                      .slug
                  }
                </p>
              ) : null}
            </div>
            <div className="pt-2">
              <img
                alt={actionData?.uiData.nftName}
                className="aspect-[1.5] max-h-[350px] w-full rounded-xl object-cover"
                src={sanitizeDStorageUrl(actionData?.uiData.nftUri)}
              />
              {nft.description && (
                <p className="my-5">
                  {showLongDescription
                    ? nft.description
                    : truncateByWords(nft.description, 30)}
                  <button
                    className="ml-1 text-black/50"
                    onClick={() => setShowLongDescription((v) => !v)}
                  >
                    {showLongDescription ? 'Show less' : 'read more'}
                  </button>
                </p>
              )}
            </div>
            <div className="ld-text-gray-500 flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Squares2X2Icon className="w-5" />
                <p>{formattedNftSchema}</p>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="w-5" />
                <p>{nft.mintCount} minted</p>
              </div>
              <div className="flex items-center gap-2">
                <ArrowTopRightOnSquareIcon className="w-5" />
                <Link
                  href={nft.mintUrl ?? ''}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  Open in {actionData?.uiData.platformName}
                </Link>
              </div>
            </div>
          </div>
          {nft.schema === 'erc1155' ? (
            <div className="flex items-center justify-between border-y border-zinc-200 px-5 py-4">
              <p className="ld-text-gray-500">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 disabled:opacity-50"
                  disabled={selectedQuantity === 1}
                  onClick={() => setSelectedQuantity(selectedQuantity - 1)}
                >
                  <MinusIcon className="w-3 text-gray-600" strokeWidth={3} />
                </button>
                <span className="w-4 text-center">{selectedQuantity}</span>
                <button
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 disabled:opacity-40"
                  onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                >
                  <PlusIcon className="w-3 text-gray-600" strokeWidth={3} />
                </button>
              </div>
            </div>
          ) : null}
          <div className="space-y-5 p-5">
            <div>
              <div className="ld-text-gray-500 flex items-center justify-between space-y-0.5">
                <span className="space-x-1">Price</span>
                <div>
                  {formattedPrice} {selectedCurrency?.symbol}
                </div>
              </div>
              <div className="ld-text-gray-500 flex items-center justify-between space-y-0.5">
                <button
                  className="flex items-baseline gap-1 space-x-1"
                  onClick={() => setShowFees((v) => !v)}
                >
                  Fees <ChevronDownIcon className="w-2" strokeWidth={3} />
                </button>
                <div>
                  {formattedTotalFees} {selectedCurrency?.symbol}
                </div>
              </div>
              {showFees ? (
                <div className="ld-text-gray-500 flex items-center justify-between space-y-0.5">
                  <span className="space-x-1">Bridge Fee</span>
                  <div>
                    {formattedTotalFees} {selectedCurrency?.symbol}
                  </div>
                </div>
              ) : null}
              <div className="mt-4 flex items-start justify-between space-y-0.5 text-xl text-gray-600">
                <span className="flex items-baseline justify-start gap-1 space-x-1">
                  Total{' '}
                  <HelpTooltip>
                    <div className="w-[210px] px-2 py-3 leading-tight">
                      {TOOLTIP_PRICE_HELP}
                    </div>
                  </HelpTooltip>
                </span>
                <div className="flex flex-col items-end">
                  <p>
                    {formattedTotalPrice} {selectedCurrency?.symbol}
                  </p>
                  <div className="ld-text-gray-500 text-sm">
                    ~$
                    {(Number(formattedTotalPrice) * usdPrice).toFixed(
                      selectedCurrency?.symbol === 'WETH' ? 4 : 2
                    )}{' '}
                  </div>
                </div>
              </div>
            </div>
            {selectedCurrency ? (
              <DecentAction
                act={
                  permit2Allowed && allowed
                    ? act
                    : () => setIsModalCollapsed(!isModalCollapsed)
                }
                allowanceLoading={allowanceLoading}
                className="w-full justify-center"
                isLoading={isLoading}
                moduleAmount={{
                  asset: {
                    contract: {
                      address: selectedCurrency.contractAddress,
                      chainId: CHAIN_ID
                    },
                    decimals: selectedCurrency.decimals,
                    name: selectedCurrency.name,
                    symbol: selectedCurrency.symbol
                  },
                  value: formattedTotalPrice
                }}
                relayStatus={relayStatus}
                txHash={txHash}
              />
            ) : null}
            <div className="flex w-full items-center justify-center text-center text-sm">
              <button
                className="lg-text-gray-500 flex items-baseline justify-center gap-1"
                onClick={() => setShowCurrencySelector(true)}
              >
                Select another token{' '}
                <ChevronRightIcon className="w-2" strokeWidth={3} />
              </button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default DecentOpenActionModule;
