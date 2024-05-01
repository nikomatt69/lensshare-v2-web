
import type { Address } from 'viem';

import errorToast from '@lib/errorToast';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import checkDispatcherPermissions from '@lensshare/lib/checkDispatcherPermissions';
import { LensHub } from '@lensshare/abis';
import { LENSHUB_PROXY } from '@lensshare/data/constants';
import { ActOnOpenActionLensManagerRequest, OnchainReferrer, useActOnOpenActionMutation, useBroadcastOnchainMutation, useCreateActOnOpenActionTypedDataMutation } from '@lensshare/lens';
import getSignature from '@lensshare/lib/getSignature';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface CreatePublicationProps {
  onSuccess?: () => void;
  signlessApproved?: boolean;
  successToast?: string;
}

const useActOnUnknownOpenAction = ({
  onSuccess,
  signlessApproved = false,
  successToast
}: CreatePublicationProps) => {
  const { currentProfile } = useProfileStore();
  const {
    setLensHubOnchainSigNonce,
    lensHubOnchainSigNonce
  } = useNonceStore();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [relayStatus, setRelayStatus] = useState<string | undefined>();
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

    onSuccess?.();
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
        try {
          const { id, typedData } = createActOnOpenActionTypedData;
          if (handleWrongNetwork()) {
            return;
          }

          if (canBroadcast) {
            const signature = await signTypedDataAsync(getSignature(typedData));
            const { data } = await broadcastOnchain({
              variables: { request: { id, signature } }
            });
            if (data?.broadcastOnchain.__typename === 'RelayError') {
              const txResult = await write({ args: [typedData.value] });
              if (txResult !== undefined) {
                setTxHash(txResult);
              }
              return txResult;
            }
            if (data?.broadcastOnchain.__typename === 'RelaySuccess') {
              setRelayStatus(data?.broadcastOnchain.txId);
            }
            setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);

            return;
          }

          const txResult = await write({ args: [typedData.value] });
          if (txResult !== undefined) {
            setTxHash(txResult);
          }
          return txResult;
        } catch (error) {
          onError(error);
        }
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
    publicationId,
    referrers
  }: {
    address: Address;
    data: string;
    publicationId: string;
    referrers?: OnchainReferrer[];
  }) => {
    try {
      setIsLoading(true);

      const actOnRequest: ActOnOpenActionLensManagerRequest = {
        actOn: { unknownOpenAction: { address, data } },
        for: publicationId,
        referrers
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
