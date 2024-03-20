import type { FC } from 'react';

import { Menu } from '@headlessui/react';
import formatAddress from '@lensshare/lib/formatAddress';
import getProfile from '@lensshare/lib/getProfile';
import getStampFyiURL from '@lensshare/lib/getStampFyiURL';
import { Image } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import getCurrentSession from '@lib/getCurrentSession';
import useEnsName from 'src/hooks/useEnsName';
import useProfileStore from 'src/store/persisted/useProfileStore';

import MenuTransition from '../MenuTransition';
import Slug from '../Slug';
import { NextLink } from './MenuItems';
import AppVersion from './NavItems/AppVersion';
import Logout from './NavItems/Logout';
import ThemeSwitch from './NavItems/ThemeSwitch';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import { useAppStore } from 'src/store/useAppStore';

const WalletUser: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const {id: sessionProfileId } = getCurrentSession();
  const { ens } = useEnsName({
    address: sessionProfileId,
    enabled: Boolean(sessionProfileId)
  });

  const Avatar = () => (
    <Image
      alt={sessionProfileId}
      className="w-8 h-8 cursor-pointer rounded-full border dark:border-gray-700"
      src={getStampFyiURL(sessionProfileId)}
    />
  );

  return (
    <Menu as="div" className="md:block">
      <Menu.Button className="outline-brand-500 flex self-center rounded-full">
        <Avatar />
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          className="absolute right-0 mt-2 w-48 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-black"
          static
        >
          <Menu.Item
            as={NextLink}
            className="m-2 flex items-center rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            href={getProfile(currentProfile).link}
          >
            <div className="flex w-full flex-col">
              <div>Logged in as</div>
              <div className="truncate">
                <Slug className="font-bold" slug={formatAddress(ens)} />
              </div>
            </div>
          </Menu.Item>
          <div className="divider" />
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
  );
};

export default WalletUser;
