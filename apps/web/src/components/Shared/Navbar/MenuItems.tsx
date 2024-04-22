import Link from 'next/link';
import type { FC } from 'react';
import { useAppStore } from 'src/store/persisted/useAppStore';

import LoginButton from './LoginButton';
import SignedUser from './SignedUser';
import WalletUser from './WalletUser';
import { isAddress } from 'viem';
import getCurrentSession from '@lib/getCurrentSession';

export const NextLink = ({ children, href, ...rest }: Record<string, any>) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
);

const MenuItems: FC = () => {
  const { currentProfile } = useAppStore();
  const { id: sessionProfileId } = getCurrentSession();

  if (currentProfile) {
    return <SignedUser />;
  }

  // If the sessionProfileId is a valid eth address, we can assume that address don't have a profile yet
  if (isAddress(sessionProfileId)) {
    return <WalletUser />;
  }

  return (
    <div className="flex items-center space-x-2">
      <LoginButton />
    </div>
  );
};

export default MenuItems;
