import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Profile } from '@lensshare/lens';
import getAvatar from '@lensshare/lib/getAvatar';
import getProfile from '@lensshare/lib/getProfile';
import { Image } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import Link from 'next/link';
import type { FC } from 'react';
import { useAppStore } from 'src/store/persisted/useAppStore';

import Slug from '../Slug';
import AppVersion from './NavItems/AppVersion';
import Bookmarks from './NavItems/Bookmarks';
import Contact from './NavItems/Contact';

import Logout from './NavItems/Logout';
import Mod from './NavItems/Mod';
import ReportBug from './NavItems/ReportBug';
import Settings from './NavItems/Settings';

import SwitchProfile from './NavItems/SwitchProfile';
import ThemeSwitch from './NavItems/ThemeSwitch';
import YourProfile from './NavItems/YourProfile';
import { ADMIN_ADDRESS2 } from '@lensshare/data/constants';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

const MobileDrawerMenu: FC = () => {
  const { currentProfile } = useAppStore();

  const { setShowMobileDrawer } = useGlobalModalStateStore();

  const closeDrawer = () => {
    setShowMobileDrawer(false);
  };

  const itemClass = 'py-3 hover:bg-gray-100 dark:hover:bg-gray-800';

  return (
    <div className="no-scrollbar fixed inset-0 z-10 h-full w-full overflow-y-auto bg-gray-100 py-4 dark:bg-black md:hidden">
      <button className="px-5" type="button" onClick={closeDrawer}>
        <XMarkIcon className="h-6 w-6" />
      </button>
      <div className="w-full space-y-2">
        <Link
          onClick={closeDrawer}
          href={getProfile(currentProfile).link}
          className="mt-2 flex items-center space-x-2 px-5 py-3 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <div className="flex w-full space-x-1.5">
            <Image
              src={getAvatar(currentProfile as Profile)}
              className="h-12 w-12 cursor-pointer rounded-full border dark:border-gray-700"
              alt={currentProfile?.id}
            />
            <div>
              Logged in as
              <div className="truncate">
                <Slug
                  className="font-bold"
                  slug={getProfile(currentProfile).slugWithPrefix}
                />
              </div>
            </div>
          </div>
        </Link>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <SwitchProfile className={cn(itemClass, 'px-4')} />
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div>
            <Link href={getProfile(currentProfile).link} onClick={closeDrawer}>
              <YourProfile className={cn(itemClass, 'px-4')} />
            </Link>
            <Link href="/settings" onClick={closeDrawer}>
              <Settings className={cn(itemClass, 'px-4')} />
            </Link>
            <Bookmarks
              className={cn(itemClass, 'px-4')}
              onClick={closeDrawer}
            />
            {currentProfile?.ownedBy.address === ADMIN_ADDRESS2 ? (
              <Link href="/mod" onClick={closeDrawer}>
                <Mod className={cn(itemClass, 'px-4')} />
              </Link>
            ) : null}

            
            <ThemeSwitch
              className={cn(itemClass, 'px-4')}
              onClick={closeDrawer}
            />
          </div>
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div>
            <Contact className={cn(itemClass, 'px-4')} onClick={closeDrawer} />
            <ReportBug
              className={cn(itemClass, 'px-4')}
              onClick={closeDrawer}
            />
          </div>
          <div className="divider" />
        </div>

        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div className="hover:bg-gray-100 dark:hover:bg-gray-800">
            <Logout
              onClick={closeDrawer}
              className={cn(itemClass, 'px-4 py-3')}
            />
          </div>
          <div className="divider" />
        </div>
        {currentProfile ? <AppVersion /> : null}
      </div>
    </div>
  );
};

export default MobileDrawerMenu;

