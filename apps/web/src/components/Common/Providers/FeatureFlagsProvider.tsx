/* eslint-disable @typescript-eslint/no-unused-vars */

import { BASE_URL } from '@lensshare/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useFeatureFlagsStore } from 'src/store/useFeatureFlagsStore';
import { isAddress } from 'viem';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import getCurrentSession from '@lib/getCurrentSession';

const FeatureFlagsProvider: FC = () => {
  const { id: sessionProfileId } = getCurrentSession();
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
        Boolean(sessionProfileId) &&
        !isAddress(sessionProfileId)
      ) {
        const response = await axios.get(
          `${BASE_URL}/api/feature/getFeatureFlags`,
          { params: { id: sessionProfileId } }
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
    queryKey: ['fetchFeatureFlags', sessionProfileId || ''],
    queryFn: fetchFeatureFlags
  });

  return null;
};

export default FeatureFlagsProvider;
