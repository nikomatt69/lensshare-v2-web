import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import type { Profile } from '@lensshare/lens';
import { Tooltip } from '@lensshare/ui';
import type { FC } from 'react';

interface EnsProps {
  profile: Profile;
}

const Ens: FC<EnsProps> = ({ profile }) => {
  if (!profile?.onchainIdentity?.ens?.name) {
    return null;
  }

  return (
    <Tooltip
      content={
        <span>
          ENS name: <b>{profile?.onchainIdentity?.ens?.name}</b>
        </span>
      }
      placement="top"
    >
      <img
        className="drop-shadow-xl"
        height={75}
        width={75}
        src={`${STATIC_ASSETS_URL}/badges/ens.png`}
        alt="ENS Badge"
      />
    </Tooltip>
  );
};

export default Ens;
