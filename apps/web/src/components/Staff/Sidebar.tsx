import type { FC } from 'react';

import Sidebar from '@components/Shared/Sidebar';
import {
  AdjustmentsHorizontalIcon,
  ClipboardIcon,
  CurrencyDollarIcon,
  UserIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import {
  ADMIN_ADDRESS,
  ADMIN_ADDRESS2,
  ADMIN_ADDRESS3
} from '@lensshare/data/constants';
import { useAppStore } from 'src/store/persisted/useAppStore';

const settingsSidebarItems = [
  {
    icon: <ClipboardIcon className="size-4" />,
    title: 'Overview',
    url: '/staff'
  },
  {
    icon: <UserIcon className="size-4" />,
    title: 'Users',
    url: '/staff/users'
  },
  {
    icon: <CurrencyDollarIcon className="size-4" />,
    title: 'Tokens',
    url: '/staff/tokens'
  },
  {
    icon: <AdjustmentsHorizontalIcon className="size-4" />,
    title: 'Feature flags',
    url: '/staff/feature-flags'
  },
  {
    icon: <UserPlusIcon className="size-4" />,
    title: 'Signup Contract',
    url: '/staff/signup-contract'
  }
];

const StaffSidebar: FC = () => {
  const { currentProfile } = useAppStore();

  if (
    currentProfile?.ownedBy.address === ADMIN_ADDRESS ||
    ADMIN_ADDRESS2 ||
    ADMIN_ADDRESS3
  ) {
    return (
      <div className="mb-4 px-3 sm:px-0">
        <Sidebar items={settingsSidebarItems} />
      </div>
    );
  }
};

export default StaffSidebar;
