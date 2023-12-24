import ToggleWithHelper from '@components/Shared/ToggleWithHelper2';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { BASE_URL, IS_MAINNET, PREFERENCES_WORKER_URL } from '@lensshare/data/constants';
import { SETTINGS } from '@lensshare/data/tracking';
import getPreferences from '@lib/api/getPreferences';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { useState, type FC } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/useAppStore';
import { hydrateAuthTokens } from 'src/store/useAuthPersistStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';

const HighSignalNotificationFilter: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const preferences = usePreferencesStore((state) => state.preferences);
  const setPreferences = usePreferencesStore((state) => state.setPreferences);
  const [updating, setUpdating] = useState(false);

  const toggleHighSignalNotificationFilter = () => {
    toast.promise(
      axios.post(
        `${BASE_URL}/api/preferences/updatePreferences`,
        {
          highSignalNotificationFilter:
            !preferences.highSignalNotificationFilter
        },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        error: () => {
          setUpdating(false);
          return 'Error updating notification preference';
        },
        loading: 'Updating preference settings...',
        success: () => {
          getPreferences(currentProfile?.id, getAuthWorkerHeaders());
          setUpdating(false);
          setPreferences({
            ...preferences,
            highSignalNotificationFilter:
              !preferences.highSignalNotificationFilter
          });
          Leafwatch.track(
            SETTINGS.PREFERENCES.TOGGLE_HIGH_SIGNAL_NOTIFICATION_FILTER,
            {
              enabled: !preferences.highSignalNotificationFilter
            }
          );

          return 'Notification preference updated';
        }
      }
    );
  };

  return (
    <ToggleWithHelper
      description="Turn on high-signal notification filter"
      disabled={updating}
      heading="Notification Signal filter"
      icon={<SwatchIcon className="h-4 w-4" />}
      on={preferences.highSignalNotificationFilter}
      setOn={toggleHighSignalNotificationFilter}
    />
  );
};

export default HighSignalNotificationFilter;
