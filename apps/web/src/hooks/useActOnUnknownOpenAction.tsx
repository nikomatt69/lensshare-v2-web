import type { ActOnOpenActionLensManagerRequest } from '@lensshare/lens';
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
import { useAppStore } from 'src/store/useAppStore';
import { useState } from 'react';

interface CreatePublicationProps {
  onCompleted: (status?: any) => void;
  onError: (error: any) => void;
}

const useActOnUnknownOpenAction = ({
  onCompleted,
  onError
}: CreatePublicationProps) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const lensHubOnchainSigNonce = useNonceStore(
    (state) => state.lensHubOnchainSigNonce
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );
  const [isLoading, setIsLoading] = useState(false);
  const { canBroadcast, canUseLensManager } =
    checkDispatcherPermissions(currentProfile);
  /*   const { canBroadcast, canUseLensManager } =
    checkDispatcherPermissions(currentProfile);
 */

  // TODO: Investigate signed transaction flow
  
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
            return write({ args: [typedData.value] });
          }
          setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);

          return;
        }

        return write({ args: [typedData.value] });
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
    const actOnRequest: ActOnOpenActionLensManagerRequest = {
      actOn: { unknownOpenAction: { address, data } },
      for: publicationId
    };

    if (canUseLensManager) {
      return await actViaLensManager(actOnRequest);
    }

    return await createActOnOpenActionTypedData({
      variables: {
        options: { overrideSigNonce: lensHubOnchainSigNonce },
        request: actOnRequest
      }
    });
  };

  return { actOnUnknownOpenAction };
};

export default useActOnUnknownOpenAction;
