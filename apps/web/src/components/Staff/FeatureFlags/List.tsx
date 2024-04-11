import type { Feature } from '@lensshare/types/hey';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@lensshare/data/constants';
import { FeatureFlag } from '@lensshare/data/feature-flags';

import formatDate from '@lensshare/lib/datetime/formatDate';
import {

  Button,
  Card,
  EmptyState,
  ErrorMessage,
  Modal
} from '@lensshare/ui';
import cn from '@lensshare/ui/cn';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

import Assign from './Assign';
import Create from './Create';
import getAuthApiHeaders from '@components/Shared/Oembed/Portal/getAuthApiHeaders main';
import getAllFeatureFlags from '@lib/api/getAllFeatureFlags';
import { Badge } from '@components/Shared/Navbar/StaffBar';

const List: FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [features, setFeatures] = useState<[] | Feature[]>([]);
  const [killing, setKilling] = useState(false);

  const { error, isLoading } = useQuery({
    queryFn: () =>
      getAllFeatureFlags(getAuthApiHeaders(), (features) =>
        setFeatures(features)
      ),
    queryKey: ['getAllFeatureFlags']
  });

  const killFeatureFlag = (id: string, enabled: boolean) => {
    setKilling(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/features/toggle`,
        { enabled, id },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: () => {
          setKilling(false);
          return 'Failed to kill feature flag';
        },
        loading: 'Killing feature flag...',
        success: () => {
          setKilling(false);
          setFeatures(
            features.map((feature) =>
              feature.id === id ? { ...feature, enabled } : feature
            )
          );
          return 'Feature flag killed';
        }
      }
    );
  };

  const deleteFeatureFlag = (id: string) => {
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/features/delete`,
        { id },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: 'Failed to delete feature flag',
        loading: 'Deleting feature flag...',
        success: () => {
          setFeatures(features.filter((feature) => feature.id !== id));
          return 'Feature flag deleted';
        }
      }
    );
  };

  return (
    <Card>
      <div className="flex items-center justify-between space-x-5 p-5">
        <div className="text-lg font-bold">Feature Flags</div>
        <Button onClick={() => setShowCreateModal(!showCreateModal)}>
          Create
        </Button>
      </div>
      <div className="divider" />
      <div className="m-5">
        {isLoading ? (
          <Loader message="Loading feature flags..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load feature flags" />
        ) : !features.length ? (
          <EmptyState
            hideCard
            icon={<AdjustmentsHorizontalIcon className="h-8 w-8" />}
            message={<span>No feature flags found</span>}
          />
        ) : (
          <div className="space-y-5">
            {features?.map((feature) => (
              <div key={feature.id}>
                <ToggleWithHelper
                  description={`Created on ${formatDate(feature.createdAt)}`}
                  heading={
                    <div className="flex items-center space-x-2">
                      <b
                        className={cn(
                          (feature.key === FeatureFlag.Suspended ||
                            feature.key === FeatureFlag.Flagged) &&
                            'text-red-500'
                        )}
                      >
                        {feature.key}
                      </b>
                      <Badge >{feature.type}</Badge>
                    </div>
                  }
                  on={feature.enabled}
                  setOn={() => killFeatureFlag(feature.id, !feature.enabled)}
                />
                <div className="mt-2 space-x-2">
                  <Button
                    onClick={() => {
                      setSelectedFeature(feature);
                      setShowAssignModal(!showAssignModal);
                    }}
                    outline
                    size="sm"
                    variant="secondary"
                  >
                    Assign
                  </Button>
                  {feature.type === 'FEATURE' && (
                    <Button
                      onClick={() => deleteFeatureFlag(feature.id)}
                      outline
                      size="sm"
                      variant="danger"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        onClose={() => setShowCreateModal(!showCreateModal)}
        show={showCreateModal}
        title="Create feature flag"
      >
        <Create
          features={features}
          setFeatures={setFeatures}
          setShowCreateModal={setShowCreateModal}
        />
      </Modal>
      <Modal
        onClose={() => setShowAssignModal(!showAssignModal)}
        show={showAssignModal}
        title={`Assign feature flag - ${selectedFeature?.key}`}
      >
        {selectedFeature ? (
          <Assign
            feature={selectedFeature}
            setShowAssignModal={setShowAssignModal}
          />
        ) : null}
      </Modal>
    </Card>
  );
};

export default List;
