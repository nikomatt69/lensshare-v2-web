import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import {
  GlobeAltIcon,
  UserGroupIcon,
  UserPlusIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ReferenceModuleType } from '@lensshare/lens';
import { Tooltip } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { motion } from 'framer-motion';
import type { FC, ReactNode } from 'react';
import { useReferenceModuleStore } from 'src/store/useReferenceModuleStore';

const ReferenceSettings: FC = () => {
  const {
    selectedReferenceModule,
    setSelectedReferenceModule,
    onlyFollowers,
    setOnlyFollowers,
    degreesOfSeparation,
    setDegreesOfSeparation
  } = useReferenceModuleStore();

  const MY_FOLLOWS = 'My follows';
  const MY_FOLLOWERS = 'My followers';
  const FRIENDS_OF_FRIENDS = 'Friends of friends';
  const EVERYONE = 'Everyone';

  const isFollowerOnlyReferenceModule =
    selectedReferenceModule === ReferenceModuleType.FollowerOnlyReferenceModule;
  const isDegreesOfSeparationReferenceModule =
    selectedReferenceModule ===
    ReferenceModuleType.DegreesOfSeparationReferenceModule;

  const isEveryone = isFollowerOnlyReferenceModule && !onlyFollowers;
  const isMyFollowers = isFollowerOnlyReferenceModule && onlyFollowers;
  const isMyFollows =
    isDegreesOfSeparationReferenceModule && degreesOfSeparation === 1;
  const isFriendsOfFriends =
    isDegreesOfSeparationReferenceModule && degreesOfSeparation === 2;

  interface ModuleProps {
    title: string;
    icon: ReactNode;
    onClick: () => void;
    selected: boolean;
  }

  const Module: FC<ModuleProps> = ({ title, icon, onClick, selected }) => (
    <Menu.Item
      as="a"
      className={cn({ 'dropdown-active': selected }, 'menu-item')}
      onClick={onClick}
    >
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-1.5">
          <div className="text-brand">{icon}</div>
          <div>{title}</div>
        </div>
        {selected ? <CheckCircleIcon className="w-5 text-green-500" /> : null}
      </div>
    </Menu.Item>
  );

  const getSelectedReferenceModuleTooltipText = () => {
    if (isMyFollowers) {
      return 'My followers can comment and mirror';
    } else if (isMyFollows) {
      return 'My follows can comment and mirror';
    } else if (isFriendsOfFriends) {
      return 'Friend of friends can comment and mirror';
    } else {
      return 'Everyone can comment and mirror';
    }
  };

  return (
    <Menu as="div">
      <Tooltip
        placement="top"
        content={getSelectedReferenceModuleTooltipText()}
      >
        <Menu.Button as={motion.button} whileTap={{ scale: 0.9 }}>
          <div className="text-brand">
            {isEveryone ? <GlobeAltIcon className="w-5" /> : null}
            {isMyFollowers ? <UsersIcon className="w-5" /> : null}
            {isMyFollows ? <UserPlusIcon className="w-5" /> : null}
            {isFriendsOfFriends ? <UserGroupIcon className="w-5" /> : null}
          </div>
        </Menu.Button>
      </Tooltip>
      <MenuTransition>
        <Menu.Items
          static
          className="absolute z-[5] mt-2 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          <Module
            title={EVERYONE}
            selected={isEveryone}
            icon={<GlobeAltIcon className="h-4 w-4" />}
            onClick={() => {
              setSelectedReferenceModule(
                ReferenceModuleType.FollowerOnlyReferenceModule
              );
              setOnlyFollowers(false);
            }}
          />
          <Module
            title={MY_FOLLOWERS}
            selected={isMyFollowers}
            icon={<UsersIcon className="h-4 w-4" />}
            onClick={() => {
              setSelectedReferenceModule(
                ReferenceModuleType.FollowerOnlyReferenceModule
              );
              setOnlyFollowers(true);
            }}
          />
          <Module
            title={MY_FOLLOWS}
            selected={isMyFollows}
            icon={<UserPlusIcon className="h-4 w-4" />}
            onClick={() => {
              setSelectedReferenceModule(
                ReferenceModuleType.DegreesOfSeparationReferenceModule
              );
              setDegreesOfSeparation(1);
            }}
          />
          <Module
            title={FRIENDS_OF_FRIENDS}
            selected={isFriendsOfFriends}
            icon={<UserGroupIcon className="h-4 w-4" />}
            onClick={() => {
              setSelectedReferenceModule(
                ReferenceModuleType.DegreesOfSeparationReferenceModule
              );
              setDegreesOfSeparation(2);
            }}
          />
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default ReferenceSettings;
