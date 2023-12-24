import { BASE_URL, PREFERENCES_WORKER_URL } from '@lensshare/data/constants';
import getPreferences from '@lib/api/getPreferences';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import getCurrentSession from '@lib/getCurrentSession';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useFeatureFlagsStore } from 'src/store/useFeatureFlagsStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';
import { useProStore } from 'src/store/useProStore';
import { isAddress } from 'viem';


const PreferencesProvider: FC = () => {
  const { id: sessionProfileId } = getCurrentSession();
  
  const setPreferences = usePreferencesStore((state) => state.setPreferences);
  const setIsPro = useProStore((state) => state.setIsPro);
  const setFeatureFlags = useFeatureFlagsStore(
    (state) => state.setFeatureFlags
  );
  const setStaffMode = useFeatureFlagsStore((state) => state.setStaffMode);
  const setGardenerMode = useFeatureFlagsStore(
    (state) => state.setGardenerMode
  );
  

  // Fetch preferences
  const fetchPreferences = async () => {
    try {
      if (Boolean(sessionProfileId) && !isAddress(sessionProfileId)) {
        const preferences = await getPreferences(
          sessionProfileId,
          getAuthWorkerHeaders()
        );

        // Profile preferences
        setPreferences({
          highSignalNotificationFilter:
            preferences.preference?.highSignalNotificationFilter || false,
          isPride: preferences.preference?.isPride || false
        });

        // Pro
        setIsPro(preferences.pro.enabled);

        // Feature flags
        setFeatureFlags(preferences.features);
        setStaffMode
        setGardenerMode

        // Membership NFT
        
      }
      return true;
    } catch {
      return false;
    }
  };

  useQuery({
    queryFn: fetchPreferences,
    queryKey: ['fetchPreferences', sessionProfileId || '']
  });

  // Fetch verified members
  

  return null;
};

export default PreferencesProvider;
