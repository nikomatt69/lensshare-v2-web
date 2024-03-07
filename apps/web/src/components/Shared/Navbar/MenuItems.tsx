import Link from 'next/link';
import type { FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';

import LoginButton from './LoginButton';
import SignedUser from './SignedUser';
import SignupButton from './SignupButton';
import WalletUser from './WalletUser';
import { isAddress } from 'viem';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import { Profile } from '@lensshare/lens';

export const NextLink = ({ children, href, ...rest }: Record<string, any>) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
);

const MenuItems: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const currentSessionProfileId = getCurrentSessionProfileId();

  if (currentProfile) {
    return <SignedUser />;
  }

  // If the currentSessionProfileId is a valid eth address, we can assume that address don't have a profile yet
  if (isAddress(currentSessionProfileId)) {
    return <WalletUser />;
  }

  return (
    <div className="flex items-center space-x-2">
      <LoginButton />
    </div>
  );
};

export default MenuItems;
