import type { ProfileOnchainIdentity } from '@lensshare/lens';
import type { FC } from 'react';

import {
  GlobeAltIcon,
  HashtagIcon,
  KeyIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import MetaDetails from '@components/StaffTools/Panels/MetaDetails';

interface OnchainIdentitiesProps {
  onchainIdentity: ProfileOnchainIdentity;
}

const OnchainIdentities: FC<OnchainIdentitiesProps> = ({ onchainIdentity }) => {
  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <AdjustmentsVerticalIcon className="h-5 w-5" />
        <div className="text-lg font-bold">Onchain Identities</div>
      </div>
      <div className="mt-3 space-y-2 font-bold">
        <MetaDetails
          icon={<KeyIcon className="ld-text-gray-500 h-4 w-4" />}
          title="ENS name"
          value={onchainIdentity.ens?.name}
        >
          {onchainIdentity.ens?.name || 'No ENS name'}
        </MetaDetails>
        <MetaDetails
          icon={<UserCircleIcon className="ld-text-gray-500 h-4 w-4" />}
          title="Has POH"
   
          value={''}
        >
          {onchainIdentity.proofOfHumanity ? 'Yes' : 'No'}
        </MetaDetails>
        <MetaDetails
          icon={<HashtagIcon className="ld-text-gray-500 h-4 w-4" />}
          title="Sybil verified"
          
          value={''}
        >
          {onchainIdentity.sybilDotOrg.verified ? 'Yes' : 'No'}
        </MetaDetails>
        <MetaDetails
          icon={<GlobeAltIcon className="ld-text-gray-500 h-4 w-4" />}
          title="Worldcoin verified"
       
          value={''}
        >
          {onchainIdentity.worldcoin.isHuman ? 'Yes' : 'No'}
        </MetaDetails>
      </div>
    </>
  );
};

export default OnchainIdentities;
