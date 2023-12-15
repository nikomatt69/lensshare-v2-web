import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { SETTINGS } from '@lensshare/data/tracking';
import type {
  ProfileInterestsRequest,
  ProfileInterestTypes
} from '@lensshare/lens';
import {
  useAddProfileInterestsMutation,
  useProfileInterestsOptionsQuery,
  useRemoveProfileInterestsMutation
} from '@lensshare/lens';
import { useApolloClient } from '@lensshare/lens/apollo';
import { Button } from '@lensshare/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import sanitizeProfileInterests from '@lib/sanitizeProfileInterests';
import type { FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';

import Loader from '../../Shared/Loader';

const MAX_TOPICS_ALLOWED = 12;

const Interests: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { cache } = useApolloClient();

  const updateCache = (interests: string[]) => {
    cache.modify({
      id: `Profile:${currentProfile?.id}`,
      fields: { interests: () => interests }
    });
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const { data, loading } = useProfileInterestsOptionsQuery({
    variables: { request: { forProfileId: currentProfile?.id } }
  });
  const [addProfileInterests] = useAddProfileInterestsMutation({
  
    onError
  });
  const [removeProfileInterests] = useRemoveProfileInterestsMutation({
   
    onError
  });

  const interestsData = data?.profileInterestsOptions as ProfileInterestTypes[];
  const selectedTopics = data?.profile?.interests ?? [];

  const onSelectTopic = (topic: ProfileInterestTypes) => {
    const request: ProfileInterestsRequest = {
      interests: [topic]
    };
    if (!selectedTopics.includes(topic)) {
      const interests = [...selectedTopics, topic];
      updateCache(interests);
      return addProfileInterests({ variables: { request } });
    }
    const topics = [...selectedTopics];
    topics.splice(topics.indexOf(topic), 1);
    updateCache(topics);
    return removeProfileInterests({ variables: { request } });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-4">
      {sanitizeProfileInterests(interestsData)?.map(
        ({ category, subCategories }) => (
          <div className="space-y-2" key={category.id}>
            <h2 className="text-sm font-medium capitalize">{category.label}</h2>
            <div className="flex flex-wrap items-center gap-3">
              {subCategories?.map((subCategory) => (
                <Button
                  key={subCategory.id}
                  variant={
                    selectedTopics.includes(subCategory.id)
                      ? 'primary'
                      : 'secondary'
                  }
                  size="sm"
                  className="font-medium capitalize"
                  disabled={
                    !selectedTopics.includes(subCategory.id) &&
                    selectedTopics.length === MAX_TOPICS_ALLOWED
                  }
                  icon={
                    selectedTopics.includes(subCategory.id) ? (
                      <CheckCircleIcon className="text-brand h-4 w-4" />
                    ) : (
                      <PlusCircleIcon className="h-4 w-4" />
                    )
                  }
                  onClick={() =>
                    onSelectTopic(subCategory.id as ProfileInterestTypes)
                  }
                  outline
                >
                  <div>{subCategory.label}</div>
                </Button>
              ))}
              {!subCategories.length ? (
                <Button
                  key={category.id}
                  variant={
                    selectedTopics.includes(category.id)
                      ? 'primary'
                      : 'secondary'
                  }
                  size="sm"
                  className="font-medium capitalize"
                  disabled={
                    !selectedTopics.includes(category.id) &&
                    selectedTopics.length === MAX_TOPICS_ALLOWED
                  }
                  icon={
                    selectedTopics.includes(category.id) ? (
                      <CheckCircleIcon className="text-brand h-4 w-4" />
                    ) : (
                      <PlusCircleIcon className="h-4 w-4" />
                    )
                  }
                  onClick={() =>
                    onSelectTopic(category.id as ProfileInterestTypes)
                  }
                  outline
                >
                  <div>{category.label}</div>
                </Button>
              ) : null}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Interests;
