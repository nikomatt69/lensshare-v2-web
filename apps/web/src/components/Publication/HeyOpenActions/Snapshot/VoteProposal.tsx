
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { SNAPSHOT_SEQUNECER_URL } from '@lensshare/data/constants';
import { Errors } from '@lensshare/data/errors';
import humanize from '@lensshare/lib/humanize';
import { Proposal } from '@lensshare/snapshot/generated';
import generateTypedData from '@lensshare/snapshot/lib/generateTypedData';
import { Button,  Spinner } from '@lensshare/ui';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/useAppStore';
import { useSignTypedData } from 'wagmi';

interface VoteProposalProps {
  proposal: Proposal;
  voteConfig: {
    show: boolean;
    position: number;
  };
  setVoteConfig: (voteConfig: { show: boolean; position: number }) => void;
  refetch?: () => void;
}

const VoteProposal: FC<VoteProposalProps> = ({
  proposal,
  voteConfig,
  setVoteConfig,
  refetch
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [voteSubmitting, setVoteSubmitting] = useState(false);
  const { signTypedDataAsync } = useSignTypedData({});

  const { id, choices, snapshot, network, strategies, space, state, symbol } =
    proposal;
  const choice = choices[voteConfig.position - 1];

  const getVotingPower = async () => {
    const response = await axios.post('https://score.snapshot.org', {
      jsonrpc: '2.0',
      method: 'get_vp',
      params: {
        address: currentProfile?.ownedBy.address,
        network,
        strategies,
        snapshot: parseInt(snapshot as string),
        space: space?.id,
        delegation: false
      },
      id: null
    });

    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['getVotingPower', currentProfile?.ownedBy.address, id],
    queryFn: getVotingPower,
    enabled: state === 'active'
  });

  const sign = async (position: number) => {
    try {
      setVoteSubmitting(true);
      const typedData = generateTypedData(
        proposal,
        position,
        currentProfile?.ownedBy.address
      );
      const signature = await signTypedDataAsync({
        primaryType: 'Vote',
        ...typedData
      });

      await axios.post(SNAPSHOT_SEQUNECER_URL, {
        address: currentProfile?.ownedBy.address,
        sig: signature,
        data: {
          domain: typedData.domain,
          types: typedData.types,
          message: typedData.message
        }
      });

      refetch?.();
      setVoteConfig({ show: false, position: 0 });
    } catch {
      toast.error(Errors.SomethingWentWrong);
    } finally {
      setVoteSubmitting(false);
    }
  };

  const totalVotingPower = data?.result?.vp;
  const voteDisabled = voteSubmitting || totalVotingPower === 0;
  const buttonLoading = voteSubmitting;

  return (
    <>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <b>Choice</b>
          <span className="max-w-xs truncate" title={choice ?? ''}>
            {choice}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <b>Snapshot</b>
          <span>{humanize(parseInt(snapshot as string))}</span>
        </div>
        <div className="flex items-center justify-between">
          <b>Your voting power</b>
          <span>
            {isLoading ? (
              <Spinner size="xs" />
            ) : error ? (
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <>
                {humanize(totalVotingPower)} {symbol}
              </>
            )}
          </span>
        </div>
      </div>
      <div className="flex space-x-2 border-t p-5">
        <Button
          className="w-full"
          size="lg"
          variant="secondary"
          onClick={() => setVoteConfig({ show: false, position: 0 })}
          outline
        >
          Cancel
        </Button>
        <Button
          disabled={voteDisabled}
          className="w-full justify-center"
          size="lg"
          icon={
            buttonLoading ? (
              <Spinner size="xs" className="mr-1" />
            ) : (
              <CheckCircleIcon className="h-5 w-5" />
            )
          }
          onClick={() => sign(voteConfig.position)}
        >
          Vote
        </Button>
      </div>
    </>
  );
};

export default VoteProposal;
