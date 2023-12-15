import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import {
  APP_NAME,
  IS_MAINNET,
  PREFERENCES_WORKER_URL
} from '@lensshare/data/constants';
import { SETTINGS } from '@lensshare/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { hydrateAuthTokens } from 'src/store/useAuthPersistStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';

const IsPride: FC = () => {
  const isPride = usePreferencesStore((state) => state.isPride);
  const setIsPride = usePreferencesStore((state) => state.setIsPride);

  const toggleIsPride = () => {
    toast.promise(
      axios.post(
        `${PREFERENCES_WORKER_URL}/update`,
        { isPride: !isPride },
        {
          headers: {
            'X-Access-Token': hydrateAuthTokens().accessToken,
            'X-Lens-Network': IS_MAINNET ? 'mainnet' : 'mainnet'
          }
        }
      ),
      {
        loading: 'Updating pride preference...',
        success: () => {
          setIsPride(!isPride);
      

          return 'Pride preference updated';
        },
        error: 'Error updating pride preference'
      }
    );
  };

  return (
    <ToggleWithHelper
      on={isPride}
      setOn={toggleIsPride}
      heading="Celebrate pride every day"
      description={`Turn this on to show your pride and turn the ${APP_NAME} logo rainbow every day.`}
      icon={<img className="h-5 w-5" src="/pride.png" alt="Pride Logo" />}
    />
  );
};

export default IsPride;
