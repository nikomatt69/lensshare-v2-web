import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import type { Profile } from '@lensshare/lens';
import { Tooltip } from '@lensshare/ui';
import type { FC } from 'react';

interface ProofOfHumanityProps {
  profile: Profile;
}

const ProofOfHumanity: FC<ProofOfHumanityProps> = ({ profile }) => {
  if (!profile?.onchainIdentity?.proofOfHumanity) {
    return null;
  }

  return (
    <Tooltip
      content={
        <span className="flex items-center space-x-1">
          <span>Proof of Humanity verified</span>
          <CheckCircleIcon className="h-4 w-4" />
        </span>
      }
      placement="top"
    >
      <img
        className="drop-shadow-xl"
        height={75}
        width={75}
        src={`${STATIC_ASSETS_URL}/badges/poh.png`}
        alt="Proof Of Humanity Badge"
      />
    </Tooltip>
  );
};

export default ProofOfHumanity;
