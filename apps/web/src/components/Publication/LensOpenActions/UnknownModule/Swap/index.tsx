import type {
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@lensshare/lens';
import { useState, type FC } from 'react';
import type { Address } from 'viem';
import { REWARDS_ADDRESS } from '@lensshare/data/constants';
import { useModuleMetadataQuery } from '@lensshare/lens';
import { Button, Card, Spinner } from '@lensshare/ui';

import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';

import {
  concat,
  decodeAbiParameters,
  encodeAbiParameters,
  pad,
  parseEther,
  toBytes,
  toHex
} from 'viem';
import toast from 'react-hot-toast';
import { CHAIN } from '@lib/costantChain';
import { CHAIN_ID } from 'src/constants';
import Loader from '@components/Shared/Loader';
import errorToast from '@lib/errorToast';
import useTokenMetadata from 'src/hooks/alchemy/useTokenMetadata';
interface SwapOpenActionProps {
  module: UnknownOpenActionModuleSettings;
  publication: MirrorablePublication;
}

const SwapOpenAction: FC<SwapOpenActionProps> = ({ module, publication }) => {

  const [value, setValue] = useState<number>(0);
  const { data, loading } = useModuleMetadataQuery({
    skip: !Boolean(module?.contract.address),
    variables: { request: { implementation: module?.contract.address } }
  });

  
  const metadata = data?.moduleMetadata?.metadata;
  const decoded = decodeAbiParameters(
    JSON.parse(metadata?.initializeCalldataABI || '{}'),
    module.initializeCalldata
  );
  const outputTokenAddress = decoded[4];
  const { data: targetToken } = useTokenMetadata({
    address: outputTokenAddress,
    chain: CHAIN_ID,
    enabled: outputTokenAddress !== undefined
  });
  const { actOnUnknownOpenAction, isLoading } = useActOnUnknownOpenAction({
    signlessApproved: true,
    successToast: "You've successfully swapped!"
  });
 
  if (loading) {
    return (
      <Card>
        <Loader message="Loading swap open action..."  />
      </Card>
    );
  }

  const act = async () => {
    if (value === 0) {
      return toast.error('Please enter a valid amount');
    }

    const abi = JSON.parse(metadata?.processCalldataABI);
    const inputTokenAddress = toBytes(
      '0x9c3c9283d3e44854697cd22d3faa240cfb032889'
    );
    const tokenAddress = toBytes(outputTokenAddress);
    const fee = toBytes(pad(toHex(10000), { size: 3 }));
    const path = concat([inputTokenAddress, fee, tokenAddress]);

    const data = {
      amountIn: parseEther(value?.toString() || '0'),
      amountOutMinimum: 0n,
      clientAddress: REWARDS_ADDRESS as Address,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 20 * 60),
      path
    };

    const calldata = encodeAbiParameters(abi, [
      toHex(data.path),
      data.deadline,
      data.amountIn,
      data.amountOutMinimum,
      data.clientAddress
    ]);

    try {
      await actOnUnknownOpenAction({
        address: module.contract.address,
        data: calldata,
        publicationId: publication.id
      });
      setValue(0);

      return;
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <Card className="space-y-3 p-5">
      <Button disabled={isLoading} onClick={act}>
        Act
      </Button>
    </Card>
  );
};

export default SwapOpenAction;
