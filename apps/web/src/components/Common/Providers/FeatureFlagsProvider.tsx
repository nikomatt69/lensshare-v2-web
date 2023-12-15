/* eslint-disable @typescript-eslint/no-unused-vars */

import { BASE_URL } from '@lensshare/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useFeatureFlagsStore } from 'src/store/useFeatureFlagsStore';
import { isAddress } from 'viem';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';

const FeatureFlagsProvider: FC = () => {
  const currentSessionProfileId = getCurrentSessionProfileId();
  const setFeatureFlags = useFeatureFlagsStore(
    (state) => state.setFeatureFlags
  );
  const setStaffMode = useFeatureFlagsStore((state) => state.setStaffMode);
  const setGardenerMode = useFeatureFlagsStore(
    (state) => state.setGardenerMode
  );
  const setLoadingFeatureFlags = useFeatureFlagsStore(
    (state) => state.setLoadingFeatureFlags
  );

  const fetchFeatureFlags = async () => {
    try {
      if (
        Boolean(currentSessionProfileId) &&
        !isAddress(currentSessionProfileId)
      ) {
        const response = await axios.get(
          `${BASE_URL}/api/feature/getFeatureFlags`,
          { params: { id: currentSessionProfileId } }
        );
        const {
          data
        }: {
          data: { features: string[] };
        } = response;

        setFeatureFlags(data?.features || []);
      }
    } catch {
    } finally {
      setLoadingFeatureFlags(false);
    }
  };

  useQuery({
    queryKey: ['fetchFeatureFlags', currentSessionProfileId || ''],
    queryFn: fetchFeatureFlags
  });

  return null;
};

export default FeatureFlagsProvider;
