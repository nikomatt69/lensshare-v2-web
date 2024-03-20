import { LENSSHARE_API_URL } from '@lensshare/data/constants';
import getPreferences from '@lib/api/getPreferences';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useFeatureFlagsStore } from 'src/store/useFeatureFlagsStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';
import { useProStore } from 'src/store/useProStore';
import { useMembershipNftStore } from 'src/store/useMembershipNftStore';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import getCurrentSession from '@lib/getCurrentSession';

const PreferencesProvider: FC = () => {
  const { id: sessionProfileId } = getCurrentSession();
  const setVerifiedMembers = useAppStore((state) => state.setVerifiedMembers);
  const setPreferences = usePreferencesStore((state) => state.setPreferences);
  const setIsPro = useProStore((state) => state.setIsPro);
  const setFeatureFlags = useFeatureFlagsStore(
    (state) => state.setFeatureFlags
  );
  const setStaffMode = useFeatureFlagsStore((state) => state.setStaffMode);
  const setGardenerMode = useFeatureFlagsStore(
    (state) => state.setGardenerMode
  );
  const setDismissedOrMinted = useMembershipNftStore(
    (state) => state.setDismissedOrMinted
  );

  // Fetch preferences
  const fetchPreferences = async () => {
    try {
      if (Boolean(sessionProfileId)) {
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
  const fetchVerifiedMembers = async () => {
    try {
      const response = await axios.get(`${LENSSHARE_API_URL}/misc/getVerified`);
      const { data } = response;
      setVerifiedMembers(data.result || []);
      return true;
    } catch {
      return false;
    }
  };

  useQuery({
    queryFn: fetchVerifiedMembers,
    queryKey: ['fetchVerifiedMembers']
  });

  return null;
};

export default PreferencesProvider;
