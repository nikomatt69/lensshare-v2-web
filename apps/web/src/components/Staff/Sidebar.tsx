import type { FC } from 'react';

import Sidebar from '@components/Shared/Sidebar';
import {
  AdjustmentsHorizontalIcon,
  ClipboardIcon,
  CurrencyDollarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import {
  ADMIN_ADDRESS,
  ADMIN_ADDRESS2,
  ADMIN_ADDRESS3
} from '@lensshare/data/constants';
import { useAppStore } from 'src/store/useAppStore';

const StaffSidebar: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (
    currentProfile?.ownedBy.address === ADMIN_ADDRESS ||
    ADMIN_ADDRESS2 ||
    ADMIN_ADDRESS3
  ) {
    return (
      <div className="mb-4 px-3 sm:px-0">
        <Sidebar
          items={[
            {
              icon: <ClipboardIcon className="h-4 w-4" />,
              title: 'Overview',
              url: '/staff'
            },
            
            {
              icon: <CurrencyDollarIcon className="h-4 w-4" />,
              title: 'Tokens',
              url: '/staff/tokens'
            },
            {
              icon: <AdjustmentsHorizontalIcon className="h-4 w-4" />,
              title: 'Feature flags',
              url: '/staff/feature-flags'
            }
          ]}
        />
      </div>
    );
  }
};

export default StaffSidebar;
