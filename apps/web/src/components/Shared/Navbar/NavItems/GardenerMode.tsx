import { BoltIcon as BoltIconOutline } from '@heroicons/react/24/outline';
import { BoltIcon as BoltIconSolid } from '@heroicons/react/24/solid';
import { IS_MAINNET, PREFERENCES_WORKER_URL } from '@lensshare/data/constants';
import { GARDENER } from '@lensshare/data/tracking';
import cn from '@lensshare/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { hydrateAuthTokens } from 'src/store/useAuthPersistStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';

interface ModModeProps {
  className?: string;
}

const GardenerMode: FC<ModModeProps> = ({ className = '' }) => {
  const gardenerMode = usePreferencesStore((state) => state.gardenerMode);
  const setGardenerMode = usePreferencesStore((state) => state.setGardenerMode);

  const toggleModMode = () => {
    toast.promise(
      axios.post(
        `${PREFERENCES_WORKER_URL}/gardenerMode`,
        { enabled: !gardenerMode },
        {
          headers: {
            'X-Access-Token': hydrateAuthTokens().accessToken,
            'X-Lens-Network': IS_MAINNET ? 'mainnet' : 'mainnet'
          }
        }
      ),
      {
        loading: 'Toggling gardener mode...',
        success: () => {
          setGardenerMode(!gardenerMode);
      

          return 'Gardener mode toggled!';
        },
        error: 'Failed to toggle gardener mode!'
      }
    );
  };

  return (
    <button
      onClick={toggleModMode}
      className={cn(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      {gardenerMode ? (
        <BoltIconSolid className="h-4 w-4 text-green-600" />
      ) : (
        <BoltIconOutline className="h-4 w-4 text-red-500" />
      )}
      <div>Gardener mode</div>
    </button>
  );
};

export default GardenerMode;
