import NotificationIcon from '@components/Notification/NotificationIcon';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { Profile } from '@lensshare/lens';
import getProfile from '@lensshare/lib/getProfile';
import cn from '@lensshare/ui/cn';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';

import MenuItems from './MenuItems';
import MoreNavItems from './MoreNavItems';
import Search from './Search';
import PlusOutline from '@components/Icons/PlusOutline';
import { ADMIN_ADDRESS2 } from '@lensshare/data/constants';

const Navbar: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();
  const isActivePath = (path: string) => router.pathname === path;
  const onProfileSelected = (profile: Profile) => {
    router.push(getProfile(profile).link);
  };

  interface NavItemProps {
    url: string;
    name: string;
    current: boolean;
  }

  const NavItem = ({ url, name, current }: NavItemProps) => {
    return (
      <Link
        href={url}
        className={cn(
          'cursor-pointer rounded-md px-2 py-1 text-left text-sm font-bold tracking-wide md:px-3',
          {
            'bg-gray-200 text-black dark:bg-gray-800 dark:text-white': current,
            'text-gray-700 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white':
              !current
          }
        )}
        aria-current={current ? 'page' : undefined}
      >
        {name}
      </Link>
    );
  };

  const NavItems = () => {
    const { pathname } = useRouter();

    return (
      <>
        <NavItem url="/" name="Home" current={pathname === '/'} />
        <NavItem
          url="/explore"
          name="Explore"
          current={pathname === '/explore'}
        />
        <NavItem
          current={pathname === '/messages'}
          name="PushChats"
          url="/messages"
        />
        <NavItem current={pathname === '/xmtp'} name="Messages" url="/xmtp" />
        {currentProfile?.ownedBy.address === ADMIN_ADDRESS2 ? (
          <NavItem current={pathname === '/staff'} name="Staff" url="/staff" />
        ) : null}
        {currentProfile?.ownedBy.address === ADMIN_ADDRESS2 ? (
          <NavItem current={pathname === '/mod'} name="Mod" url="/mod" />
        ) : null}
        <MoreNavItems />
      </>
    );
  };

  return (
    <header className="divider fixed inset-x-0 top-0 z-10 w-full bg-white dark:bg-black">
      <div className="container sticky mx-auto max-w-screen-xl px-5">
        <div className="relative flex h-14 items-center justify-between sm:h-16">
          <div className="flex items-center justify-start">
            <button
              className="inline-flex items-center justify-center rounded-md text-gray-500 focus:outline-none md:hidden"
              onClick={() => setShowSearch(!showSearch)}
            >
              {showSearch ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <MagnifyingGlassIcon className="h-6 w-6" />
              )}
            </button>
            <Link href="/" className="hidden md:block">
              <img
                className="h-8 w-8"
                height={32}
                width={32}
                src={'/logo.png'}
                alt="Logo"
              />
            </Link>
            <div className="hidden sm:ml-6 md:block">
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <Search onProfileSelected={onProfileSelected} />
                </div>
                <NavItems />
              </div>
            </div>
          </div>
          <Link
            href="/"
            className={cn('md:hidden', !currentProfile?.id && 'ml-[60px]')}
          >
            <img
              className="h-7 w-7"
              height={32}
              width={32}
              src={'/logo.png'}
              alt="Logo"
            />
          </Link>
          <div className="flex items-center gap-3">
            {currentProfile ? <NotificationIcon /> : null}
            <Link href="/create" className="mx-auto my-2">
              {isActivePath('/create') ? (
                <PlusOutline className="text-brand h-6 w-6" />
              ) : (
                <PlusIcon className="h-6 w-6" />
              )}
            </Link>

            <MenuItems />
          </div>
        </div>
      </div>
      {showSearch ? (
        <div className="m-3 md:hidden">
          <Search hideDropdown onProfileSelected={onProfileSelected} />
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
