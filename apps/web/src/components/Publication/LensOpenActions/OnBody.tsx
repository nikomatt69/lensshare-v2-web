import type {
  AnyPublication,
  UnknownOpenActionModuleSettings
} from '@lensshare/lens';
import type { FC } from 'react';

import { VerifiedOpenActionModules } from '@lensshare/data/verified-openaction-modules';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';

import SwapOpenAction from './UnknownModule/Swap';
import PolymarketEditor from './UnknownModule/Polymarket';

interface OpenActionOnBodyProps {
  publication: AnyPublication;
}

const OpenActionOnBody: FC<OpenActionOnBodyProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const module = targetPublication.openActionModules.find(
    (module) => module.contract.address === VerifiedOpenActionModules.Swap
  );

  if (!module) {
    return null;
  }

  return (
    <div className="mt-3">
      {module.contract.address === VerifiedOpenActionModules.Swap && (
        <SwapOpenAction
          module={module as UnknownOpenActionModuleSettings}
          publication={targetPublication}
        />
      )}
      {module.contract.address === VerifiedOpenActionModules.Swap && (
        <PolymarketEditor
          module={module as UnknownOpenActionModuleSettings}
          publication={targetPublication}
        />
      )}
    </div>
  );
};

export default OpenActionOnBody;
