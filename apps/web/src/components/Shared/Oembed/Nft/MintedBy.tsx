import SmallWalletProfile from '@components/Shared/SmallWalletProfile';
import type { FC } from 'react';
import type { Address } from 'viem';

interface MintedByProps {
  address: Address;
}

const MintedBy: FC<MintedByProps> = ({ address }) => {
  if (!address) {
    return null;
  }

  // TODO: use default profile
  return (
    <div className="absolute left-3 top-3 rounded-lg bg-gray-950/70 px-2 py-1 text-sm text-white">
      <SmallWalletProfile address={address} smallAvatar />
    </div>
  );
};

export default MintedBy;
