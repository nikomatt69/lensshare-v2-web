import type {
  AnyPublication,
  LegacyMultirecipientFeeCollectModuleSettings,
  LegacySimpleCollectModuleSettings,
  MultirecipientFeeCollectOpenActionSettings,
  OpenActionModule,
  SimpleCollectOpenActionSettings
} from '@lensshare/lens';
import type { FC } from 'react';

import CollectWarning from '@components/Shared/CollectWarning';
import CountdownTimer from '@components/Shared/CountdownTimer';
import Collectors from '@components/Shared/Modal/Collectors';
import Slug from '@components/Shared/Slug';
import {
  BanknotesIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  PuzzlePieceIcon,
  RectangleStackIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { POLYGONSCAN_URL } from '@lensshare/data/constants';
import { FollowModuleType } from '@lensshare/lens';

import formatAddress from '@lensshare/lib/formatAddress';
import getAssetSymbol from '@lensshare/lib/getAssetSymbol';
import getProfile from '@lensshare/lib/getProfile';
import getRedstonePrice from '@lib/getRedstonePrice';
import getTokenImage from '@lensshare/lib/getTokenImage';
import humanize from '@lensshare/lib/humanize';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import { Modal, Tooltip } from '@lensshare/ui';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import plur from 'plur';
import { useState } from 'react';

import CollectAction from './CollectAction';
import Splits from './Splits';

interface CollectModuleProps {
  openAction: OpenActionModule;
  publication: AnyPublication;
}

const CollectModule: FC<CollectModuleProps> = ({ openAction, publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

 

  const [showCollectorsModal, setShowCollectorsModal] = useState(false);
  const [countOpenActions, setCountOpenActions] = useState(
    targetPublication.stats.countOpenActions
  );

  const collectModule = openAction as
    | LegacyMultirecipientFeeCollectModuleSettings
    | LegacySimpleCollectModuleSettings
    | MultirecipientFeeCollectOpenActionSettings
    | SimpleCollectOpenActionSettings;

  const endTimestamp = collectModule?.endsAt;
  const collectLimit = parseInt(collectModule?.collectLimit || '0');
  const amount = parseFloat(collectModule?.amount?.value || '0');
  const currency = collectModule?.amount?.asset?.symbol;
  const referralFee = collectModule?.referralFee;
  const isMultirecipientFeeCollectModule =
    collectModule.__typename === 'MultirecipientFeeCollectOpenActionSettings';
  const percentageCollected = (countOpenActions / collectLimit) * 100;


  const { data: usdPrice } = useQuery({
    enabled: Boolean(amount),
    queryFn: async () => await getRedstonePrice(getAssetSymbol(currency)),
    queryKey: ['getRedstonePrice', currency]
  });

  return (
    <>
      {collectLimit ? (
        <Tooltip
          content={`${percentageCollected.toFixed(0)}% Collected`}
          placement="top"
        >
          <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700">
            <div
              className="bg-brand-500 h-2.5"
              style={{ width: `${percentageCollected}%` }}
            />
          </div>
        </Tooltip>
      ) : null}
      <div className="p-5">
        {collectModule?.followerOnly ? (
          <div className="pb-5">
            <CollectWarning
              handle={getProfile(publication.by).slugWithPrefix}
              isSuperFollow={
                publication?.by?.followModule?.type ===
                FollowModuleType.FeeFollowModule
              }
            />
          </div>
        ) : null}
        <div className="mb-4">
          <div className="text-xl font-bold">
            {targetPublication.__typename} by{' '}
            <Slug slug={getProfile(targetPublication.by).slugWithPrefix} />
          </div>
        </div>
        {amount ? (
          <div className="flex items-center space-x-1.5 py-2">
            <img
              className="h-7 w-7"
              height={28}
              width={28}
              src={getTokenImage(currency)}
              alt={currency}
              title={currency}
            />
            <span className="space-x-1">
              <span className="text-2xl font-bold">{amount}</span>
              <span className="text-xs">{currency}</span>
              {usdPrice ? (
                <>
                  <span className="lt-text-gray-500 px-0.5">·</span>
                  <span className="lt-text-gray-500 text-xs font-bold">
                    ${(amount * usdPrice).toFixed(2)}
                  </span>
                </>
              ) : null}
            </span>
          </div>
        ) : null}
        <div className="space-y-1.5">
          <div className="block items-center space-y-1 sm:flex sm:space-x-5">
            <div className="flex items-center space-x-2">
              <UsersIcon className="ld-text-gray-500 h-4 w-4" />
              <button
                className="font-bold"
                onClick={() => setShowCollectorsModal(!showCollectorsModal)}
                type="button"
              >
                {humanize(countOpenActions)}{' '}
                {plur('collector', countOpenActions)}
              </button>
              <Modal
                icon={<RectangleStackIcon className="text-brand-500 h-5 w-5" />}
                onClose={() => setShowCollectorsModal(false)}
                show={showCollectorsModal}
                title="Collected by"
              >
                <Collectors publicationId={targetPublication.id} />
              </Modal>
            </div>
            {collectLimit ? (
              <div className="flex items-center space-x-2">
                <PhotoIcon className="ld-text-gray-500 h-4 w-4" />
                <div className="font-bold">
                  {collectLimit - countOpenActions} available
                </div>
              </div>
            ) : null}
            {referralFee ? (
              <div className="flex items-center space-x-2">
                <BanknotesIcon className="ld-text-gray-500 h-4 w-4" />
                <div className="font-bold">{referralFee}% referral fee</div>
              </div>
            ) : null}
          </div>
          {endTimestamp ? (
            <div className="flex items-center space-x-2">
              <ClockIcon className="ld-text-gray-500 h-4 w-4" />
              <div className="space-x-1.5">
                <span>Sale Ends:</span>
                <span className="font-bold text-gray-600">
                  <CountdownTimer targetDate={endTimestamp} />
                </span>
              </div>
            </div>
          ) : null}
          {collectModule.contract.address ? (
            <div className="flex items-center space-x-2">
              <PuzzlePieceIcon className="ld-text-gray-500 h-4 w-4" />
              <div className="space-x-1.5">
                <span>Token:</span>
                <Link
                  className="font-bold text-gray-600"
                  href={`${POLYGONSCAN_URL}/token/${collectModule.contract.address}`}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {formatAddress(collectModule.contract.address)}
                </Link>
              </div>
            </div>
          ) : null}
          {isMultirecipientFeeCollectModule ? (
            <Splits recipients={collectModule?.recipients} />
          ) : null}
        </div>
        <div className="flex items-center space-x-2">
          <CollectAction
            countOpenActions={countOpenActions}
            openAction={openAction}
            publication={publication}
            setCountOpenActions={setCountOpenActions}
          />
        </div>
      </div>
    </>
  );
};

export default CollectModule;
