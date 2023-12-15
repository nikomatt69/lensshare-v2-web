import { ShieldCheckIcon as ShieldCheckIconOutline } from '@heroicons/react/24/outline';
import { ShieldCheckIcon as ShieldCheckIconSolid } from '@heroicons/react/24/solid';
import { IS_MAINNET, PREFERENCES_WORKER_URL } from '@lensshare/data/constants';
import { STAFFTOOLS } from '@lensshare/data/tracking';
import cn from '@lensshare/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { hydrateAuthTokens } from 'src/store/useAuthPersistStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';

interface StaffModeProps {
  className?: string;
}

const StaffMode: FC<StaffModeProps> = ({ className = '' }) => {
  const staffMode = usePreferencesStore((state) => state.staffMode);
  const setStaffMode = usePreferencesStore((state) => state.setStaffMode);

  const toggleStaffMode = async () => {
    toast.promise(
      axios.post(
        `${PREFERENCES_WORKER_URL}/staffMode`,
        { enabled: !staffMode },
        {
          headers: {
            'X-Access-Token': hydrateAuthTokens().accessToken,
            'X-Lens-Network': IS_MAINNET ? 'mainnet' : 'mainnet'
          }
        }
      ),
      {
        loading: 'Toggling staff mode...',
        success: () => {
          setStaffMode(!staffMode);

          return 'Staff mode toggled!';
        },
        error: 'Failed to toggle staff mode!'
      }
    );
  };

  return (
    <button
      onClick={toggleStaffMode}
      className={cn(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      {staffMode ? (
        <ShieldCheckIconSolid className="h-4 w-4 text-green-600" />
      ) : (
        <ShieldCheckIconOutline className="h-4 w-4 text-red-500" />
      )}
      <div>Staff mode</div>
    </button>
  );
};

export default StaffMode;
