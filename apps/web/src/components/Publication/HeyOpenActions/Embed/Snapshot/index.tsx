import { HEY_POLLS_SPACE } from '@lensshare/data/constants';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import type { Proposal, Vote } from '@lensshare/snapshot';
import { useProposalQuery } from '@lensshare/snapshot';
import { snapshotApolloClient } from '@lensshare/snapshot/apollo';
import type { SnapshotMetadata } from '@lensshare/types/embed';
import { Spinner } from '@lensshare/ui';
import type { FC } from 'react';
import { useAppStore } from 'src/store/persisted/useAppStore';

import Wrapper from '../../../../Shared/Embed/Wrapper';
import Choices from './Choices';
import Header from './Header';

interface SnapshotProps {
  embedMetadata: SnapshotMetadata;
}

const Snapshot: FC<SnapshotProps> = ({ embedMetadata }) => {
  const { currentProfile } = useAppStore();
  const { proposal: proposalId } = embedMetadata;

  const { data, loading, error, refetch } = useProposalQuery({
    client: snapshotApolloClient,
    variables: {
      id: proposalId,
      where: { proposal: proposalId, voter: currentProfile?.ownedBy.address }
    }
  });

  if (loading) {
    // TODO: Add skeleton loader here
    return (
      <Wrapper>
        <div className="flex items-center justify-center">
          <Spinner size="xs" />
        </div>
      </Wrapper>
    );
  }

  if (!data?.proposal || error) {
    return null;
  }

  const { proposal, votes } = data;
  const isHeyPoll = proposal?.space?.id === HEY_POLLS_SPACE;

  if (!proposal) {
    return null;
  }

  if (isHeyPoll) {
    return (
      <span onClick={stopEventPropagation} aria-hidden="true">
        <Choices
          proposal={proposal as Proposal}
          votes={votes as Vote[]}
          isHeyPoll={isHeyPoll}
          refetch={refetch}
        />
      </span>
    );
  }

  return (
    <Wrapper>
      <Header proposal={proposal as Proposal} />
      <Choices
        proposal={proposal as Proposal}
        votes={votes as Vote[]}
        refetch={refetch}
      />
    </Wrapper>
  );
};

export default Snapshot;
