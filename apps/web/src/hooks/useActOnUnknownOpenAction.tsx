import type {
  ActOnOpenActionLensManagerRequest,
  BroadcastOnchainMutation
} from '@lensshare/lens';
import type { Address } from 'viem';

import { LensHub } from '@lensshare/abis';
import { LENSHUB_PROXY } from '@lensshare/data/constants';
import {
  useActOnOpenActionMutation,
  useBroadcastOnchainMutation,
  useCreateActOnOpenActionTypedDataMutation
} from '@lensshare/lens';
import checkDispatcherPermissions from '@lensshare/lib/checkDispatcherPermissions';
import getSignature from '@lensshare/lib/getSignature';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useContractWrite, useSignTypedData } from 'wagmi';
import { useState } from 'react';
import useHandleWrongNetwork from './useHandleWrongNetwork';
import toast from 'react-hot-toast';
import errorToast from '@lib/errorToast';

interface CreatePublicationProps {
  signlessApproved?: boolean;
  successToast?: string;
}

const useActOnUnknownOpenAction = ({
  signlessApproved = false,
  successToast
}: CreatePublicationProps) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const lensHubOnchainSigNonce = useNonceStore(
    (state) => state.lensHubOnchainSigNonce
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [relayStatus, setRelayStatus] = useState<
    BroadcastOnchainMutation | undefined
  >();
  const handleWrongNetwork = useHandleWrongNetwork();

  const { canBroadcast, canUseLensManager } =
    checkDispatcherPermissions(currentProfile);

  const onError = (error?: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const onCompleted = (
    __typename?: 'LensProfileManagerRelayError' | 'RelayError' | 'RelaySuccess'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return;
    }

    setIsLoading(false);
    toast.success(successToast || 'Success!');
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { write } = useContractWrite({
    abi: LensHub,
    address: LENSHUB_PROXY,
    functionName: 'act',
    onError: (error: any) => {
      onError(error);
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1);
    },
    onSuccess: () => {
      onCompleted();
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
    }
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });


  const [createActOnOpenActionTypedData] =
    useCreateActOnOpenActionTypedDataMutation({
      onCompleted: async ({ createActOnOpenActionTypedData }) => {
        const { id, typedData } = createActOnOpenActionTypedData;

        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          });
          if (data?.broadcastOnchain.__typename === 'RelayError') {
            const txResult = await write({ args: [typedData.value] });
            
          }
          setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);

          console.log('Broadcast Status');
          console.log(data);
          if (data) {
            setRelayStatus(data);
          }
          return;
        }

        const txResult = await write({ args: [typedData.value] });
      },
      onError
    });

  // Act
  const [actOnOpenAction] = useActOnOpenActionMutation({
    onCompleted: ({ actOnOpenAction }) =>
      onCompleted(actOnOpenAction.__typename),
    onError
  });

  // Act via Lens Manager
  const actViaLensManager = async (
    request: ActOnOpenActionLensManagerRequest
  ) => {
    const { data, errors } = await actOnOpenAction({ variables: { request } });

    if (errors?.toString().includes('has already acted on')) {
      return;
    }

    if (
      !data?.actOnOpenAction ||
      data?.actOnOpenAction.__typename === 'LensProfileManagerRelayError'
    ) {
      return await createActOnOpenActionTypedData({ variables: { request } });
    }
  };

  const actOnUnknownOpenAction = async ({
    address,
    data,
    publicationId
  }: {
    address: Address;
    data: string;
    publicationId: string;
  }) => {
    try {
      setIsLoading(true);

      const actOnRequest: ActOnOpenActionLensManagerRequest = {
        actOn: { unknownOpenAction: { address, data } },
        for: publicationId
      };

      if (canUseLensManager && signlessApproved) {
        return await actViaLensManager(actOnRequest);
      }

      return await createActOnOpenActionTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: actOnRequest
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  return { actOnUnknownOpenAction, isLoading, relayStatus, txHash };
};

export default useActOnUnknownOpenAction;
