import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import type {
  LastLoggedInProfileRequest,
  Profile,
  ProfileManagersRequest
} from '@lensshare/lens';
import { useProfilesManagedQuery } from '@lensshare/lens';
import { EmptyState, ErrorMessage } from '@lensshare/ui';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { useAccount } from 'wagmi';

const List: FC = () => {
  const { address } = useAccount();

  const request: ProfileManagersRequest | LastLoggedInProfileRequest = {
    for: address
  };
  const { data, loading, error, fetchMore } = useProfilesManagedQuery({
    variables: {
      profilesManagedRequest: request,
      lastLoggedInProfileRequest: request
    }
  });

  const profilesManaged = data?.profilesManaged.items;
  const pageInfo = data?.profilesManaged?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      return await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  });

  if (loading) {
    return (
      <div className="pb-5">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage title="Failed to load managed profiles" error={error} />
    );
  }

  if (profilesManaged?.length === 0) {
    return (
      <EmptyState
        message="You are not managing any profiles!"
        icon={<UsersIcon className="text-brand h-8 w-8" />}
        hideCard
      />
    );
  }

  return (
    <div className="space-y-4">
      {profilesManaged?.map((profile) => (
        <div key={profile.id}>
          <UserProfile profile={profile as Profile} />
        </div>
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </div>
  );
};

export default List;
