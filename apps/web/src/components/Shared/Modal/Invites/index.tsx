import Loader from '@components/Shared/Loader';
import type { InvitedResult } from '@lensshare/lens';
import { useInvitedProfilesQuery } from '@lensshare/lens';
import { ErrorMessage } from '@lensshare/ui';
import type { FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';

import Invite from './Invite';
import Invited from './Invited';

const Invites: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { data, loading, error, refetch } = useInvitedProfilesQuery();

  if (loading) {
    return <Loader message="Loading invites" />;
  }

  if (error) {
    return <ErrorMessage title="Failed to load invites" error={error} />;
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto p-5">
      <Invite
        invitesLeft={currentProfile?.invitesLeft ?? 0}
        refetch={refetch}
      />
      <div className="divider my-5" />
      <Invited invitedProfiles={data?.invitedProfiles as InvitedResult[]} />
    </div>
  );
};

export default Invites;
