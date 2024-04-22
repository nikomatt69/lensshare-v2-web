import type { Feature } from '@lensshare/types/hey';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { HEY_API_URL } from '@lensshare/data/constants';
import { STAFFTOOLS } from '@lensshare/data/tracking';

import { Toggle } from '@lensshare/ui';

import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

import ToggleWrapper from './ToggleWrapper';
import getAllFeatureFlags from '@lib/api/getAllFeatureFlags';
import getAuthApiHeaders from '@components/Shared/Oembed/Portal/getAuthApiHeaders main';

interface UpdateFeatureFlagsProps {
  flags: string[];
  profileId: string;
  setFlags: (flags: string[]) => void;
}

const UpdateFeatureFlags: FC<UpdateFeatureFlagsProps> = ({
  flags,
  profileId,
  setFlags
}) => {
  const [updating, setUpdating] = useState(false);

  const { data: allFeatureFlags, isLoading } = useQuery({
    queryFn: () => getAllFeatureFlags(getAuthApiHeaders()),
    queryKey: ['getAllFeatureFlags']
  });

  if (isLoading) {
    return <Loader  message="Loading feature flags" />;
  }

  const availableFeatures = allFeatureFlags || [];
  const enabledFlags = flags;

  const updateFeatureFlag = (feature: Feature) => {
    const { id, key } = feature;
    const enabled = !enabledFlags.includes(key);

    setUpdating(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/features/assign`,
        { enabled, id, profile_id: profileId },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: () => {
          setUpdating(false);
          return 'Failed to update feature flag';
        },
        loading: 'Updating feature flag...',
        success: () => {
          Leafwatch.track(STAFFTOOLS.TOGGLE_MODE, {
            feature: key,
            profile_id: profileId
          });
          setUpdating(false);
          setFlags(
            enabled
              ? [...enabledFlags, key]
              : enabledFlags.filter((f) => f !== key)
          );
          return 'Feature flag updated';
        }
      }
    );
  };

  return (
    <div className="space-y-2 font-bold">
      {availableFeatures.map((feature) => (
        <ToggleWrapper key={feature.id} title={feature.key}>
          <Toggle
        
            on={enabledFlags.includes(feature.key)}
            setOn={() => updateFeatureFlag(feature)}
          />
        </ToggleWrapper>
      ))}
    </div>
  );
};

export default UpdateFeatureFlags;
