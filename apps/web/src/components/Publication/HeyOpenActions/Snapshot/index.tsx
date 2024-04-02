import type { FC } from 'react';
import { useAppStore } from 'src/store/persisted/useAppStore';

import Choices from './Choices';
import Header from './Header';
import Wrapper from '@components/Shared/Embed/Wrapper';
import { Spinner } from '@lensshare/ui';
import { snapshotApolloClient } from '@lensshare/snapshot/apollo';
import { Proposal, Vote, useProposalQuery } from '@lensshare/snapshot';
import { HEY_POLLS_SPACE } from '@lensshare/data/constants';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';

interface SnapshotProps {
  proposalId: string;
}

const Snapshot: FC<SnapshotProps> = ({ proposalId }) => {
  const { currentProfile } = useAppStore();

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
  const isLensterPoll = proposal?.space?.id === HEY_POLLS_SPACE;

  if (!proposal) {
    return null;
  }

  if (isLensterPoll) {
    return (
      <span
        onClick={stopEventPropagation}
        data-testid={`poll-${proposal.id}`}
        aria-hidden="true"
      >
        <Choices
          proposal={proposal as Proposal}
          votes={votes as Vote[]}
          isLensterPoll={isLensterPoll}
          refetch={refetch}
        />
      </span>
    );
  }

  return (
    <Wrapper className={`snapshot-${proposal.id}`}>
      <div className="font-poppins text-xs">
        {' '}
        <div>
          <Header proposal={proposal as Proposal} />
        </div>
        <Choices
          proposal={proposal as Proposal}
          votes={votes as Vote[]}
          refetch={refetch}
        />
      </div>
    </Wrapper>
  );
};

export default Snapshot;
