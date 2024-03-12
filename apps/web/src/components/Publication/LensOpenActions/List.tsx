import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { type AnyPublication, OpenActionModuleType } from '@lensshare/lens';
import getOpenActionModuleData from '@lensshare/lib/getOpenActionModuleData';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import { Card } from '@lensshare/ui';
import type { FC } from 'react';
import { useState } from 'react';

import CollectModule from './CollectModule';

import UnknownModulePreview from './UnknownModule/Preview';
import { VerifiedOpenActionModules } from '@lensshare/data/verified-openaction-modules';
import allowedOpenActionModules from '@lib/allowedOpen (1)';

const IgnoredModules = [
  VerifiedOpenActionModules.Tip,
  VerifiedOpenActionModules.DecentNFT
];

interface ListProps {
  publication: AnyPublication;
}

const List: FC<ListProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const openActions = targetPublication.openActionModules?.filter(
    (module) => !IgnoredModules.includes(module.contract.address)
  );

  return (
    <div className="gap-y-4 divide-y dark:divide-gray-700">
      {openActions?.map((action) =>
        allowedOpenActionModules.includes(action.type) ? (
          <CollectModule
            key={action.type}
            openAction={action}
            publication={publication}
          />
        ) : (
          <div className="w-full p-5" key={action.contract.address}>
            <UnknownModulePreview module={action} />
          </div>
        )
      )}
    </div>
  );
};

export default List;