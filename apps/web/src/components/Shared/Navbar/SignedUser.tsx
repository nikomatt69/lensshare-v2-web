import { Menu } from '@headlessui/react';
import type { Profile } from '@lensshare/lens';
import getAvatar from '@lensshare/lib/getAvatar';
import getProfile from '@lensshare/lib/getProfile';
import { Image } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import type { FC } from 'react';
import { useAppStore } from 'src/store/persisted/useAppStore';


import MenuTransition from '../MenuTransition';
import Slug from '../Slug';
import { NextLink } from './MenuItems';
import MobileDrawerMenu from './MobileDrawerMenu';
import AppVersion from './NavItems/AppVersion';

import Logout from './NavItems/Logout';
import Mod from './NavItems/Mod';
import Settings from './NavItems/Settings';
import SwitchProfile from './NavItems/SwitchProfile';
import ThemeSwitch from './NavItems/ThemeSwitch';
import YourProfile from './NavItems/YourProfile';
import {
  ADMIN_ADDRESS,
  ADMIN_ADDRESS2,
  ADMIN_ADDRESS3
} from '@lensshare/data/constants';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

const SignedUser: FC = () => {
  const { currentProfile } = useAppStore();

  const { setShowMobileDrawer, showMobileDrawer } = useGlobalModalStateStore();

  const Avatar = () => (
    <Image
      src={getAvatar(currentProfile as Profile)}
      className="h-8 w-8 cursor-pointer rounded-full border dark:border-gray-700"
      alt={currentProfile?.id}
    />
  );

  const openMobileMenuDrawer = () => {
    setShowMobileDrawer(true);
  };

  return (
    <>
      {showMobileDrawer ? <MobileDrawerMenu /> : null}
      <button
        className="focus:outline-none md:hidden"
        onClick={() => openMobileMenuDrawer()}
      >
        <Avatar />
      </button>
      <Menu as="div" className="hidden md:block">
        <Menu.Button className="flex self-center">
          <Avatar />
        </Menu.Button>
        <MenuTransition>
          <Menu.Items
            static
            className="absolute right-0 mt-2 w-48 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-black"
          >
            <Menu.Item
              as={NextLink}
              href={getProfile(currentProfile).link}
              className="m-2 flex items-center rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <div className="flex w-full flex-col">
                <div>Logged in as</div>
                <div className="truncate">
                  <Slug
                    className="font-bold"
                    slug={getProfile(currentProfile).slugWithPrefix}
                  />
                </div>
              </div>
            </Menu.Item>
            <div className="divider" />
            <Menu.Item
              as="div"
              className={({ active }: { active: boolean }) =>
                cn(
                  { 'dropdown-active': active },
                  'm-2 rounded-lg border dark:border-gray-700'
                )
              }
            >
              <SwitchProfile />
            </Menu.Item>
            <div className="divider" />
            <Menu.Item
              as={NextLink}
              href={getProfile(currentProfile).link}
              className={({ active }: { active: boolean }) =>
                cn({ 'dropdown-active': active }, 'menu-item')
              }
            >
              <YourProfile />
            </Menu.Item>
            <Menu.Item
              as={NextLink}
              href="/settings"
              className={({ active }: { active: boolean }) =>
                cn({ 'dropdown-active': active }, 'menu-item')
              }
            >
              <Settings />
            </Menu.Item>
            {currentProfile?.ownedBy.address === ADMIN_ADDRESS ||
            ADMIN_ADDRESS2 ||
            ADMIN_ADDRESS3 ? (
              <Menu.Item
                as={NextLink}
                href="/mod"
                className={({ active }: { active: boolean }) =>
                  cn({ 'dropdown-active': active }, 'menu-item')
                }
              >
                <Mod />
              </Menu.Item>
            ) : null}
           
            <Menu.Item
              as="div"
              className={({ active }) =>
                cn({ 'dropdown-active': active }, 'm-2 rounded-lg')
              }
            >
              <Logout />
            </Menu.Item>
            <div className="divider" />
            <Menu.Item
              as="div"
              className={({ active }) =>
                cn({ 'dropdown-active': active }, 'm-2 rounded-lg')
              }
            >
              <ThemeSwitch />
            </Menu.Item>

            <div className="divider" />
            <AppVersion />
          </Menu.Items>
        </MenuTransition>
      </Menu>
    </>
  );
};

export default SignedUser;
