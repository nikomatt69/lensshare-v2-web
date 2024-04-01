import type {
  AnyPublication,
  LatestActed,
  LegacyFeeCollectModuleSettings,
  LegacyFreeCollectModuleSettings,
  LegacyLimitedFeeCollectModuleSettings,
  LegacyLimitedTimedFeeCollectModuleSettings,
  LegacyMultirecipientFeeCollectModuleSettings,
  LegacySimpleCollectModuleSettings,
  LegacyTimedFeeCollectModuleSettings,
  MultirecipientFeeCollectOpenActionSettings,
  SimpleCollectOpenActionSettings
} from '@lensshare/lens';
import type { FC } from 'react';

import SmallUserProfile from '@components/Shared/SmallUserProfile';

import getTokenImage from '@lensshare/lib/getTokenImage';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import getCollectModuleData from 'src/hooks/getCollectModuleData';

interface OpenActionPaidActionProps {
  latestActed: LatestActed[];
  publication: AnyPublication;
}

const OpenActionPaidAction: FC<OpenActionPaidActionProps> = ({
  latestActed,
  publication
}) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;

  const openActions = targetPublication.openActionModules
    .filter(
      (module) =>
        module.__typename !== 'LegacyAaveFeeCollectModuleSettings' &&
        module.__typename !== 'LegacyERC4626FeeCollectModuleSettings' &&
        module.__typename !== 'LegacyFreeCollectModuleSettings' &&
        module.__typename !== 'LegacyRevertCollectModuleSettings' &&
        module.__typename !== 'UnknownOpenActionModuleSettings'
    )
    .map((module) =>
      getCollectModuleData(
        module as
          | LegacyFeeCollectModuleSettings
          | LegacyFreeCollectModuleSettings
          | LegacyLimitedFeeCollectModuleSettings
          | LegacyLimitedTimedFeeCollectModuleSettings
          | LegacyMultirecipientFeeCollectModuleSettings
          | LegacySimpleCollectModuleSettings
          | LegacyTimedFeeCollectModuleSettings
          | MultirecipientFeeCollectOpenActionSettings
          | SimpleCollectOpenActionSettings
      )
    );

  return (
    <div className="blur-10 rounded-t-xl bg-emerald-500/90 px-5 py-3 text-sm">
      {openActions.map((openAction, index) => (
        <div
          className="flex items-center space-x-2"
          key={`${openAction?.assetAddress}_${index}}`}
        >
          <b>Price</b>
          <img
            alt={openAction?.assetSymbol}
            className="h-5 w-5"
            src={getTokenImage(openAction?.assetSymbol as string)}
          />
          <span>
            {openAction?.amount} {openAction?.assetSymbol}
          </span>
          <span>by</span>
          <span>
            <SmallUserProfile
              linkToProfile
              profile={latestActed[0].profile}
              smallAvatar
              timestamp={latestActed[0].actedAt}
            />
          </span>
        </div>
      ))}
    </div>
  );
};

export default OpenActionPaidAction;
