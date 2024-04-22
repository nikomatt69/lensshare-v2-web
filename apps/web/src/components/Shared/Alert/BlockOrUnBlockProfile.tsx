import { LensHub } from '@lensshare/abis';
import { LENSHUB_PROXY } from '@lensshare/data/constants';
import { PROFILE } from '@lensshare/data/tracking';
import type { BlockRequest, UnblockRequest } from '@lensshare/lens';
import {
  useBlockMutation,
  useBroadcastOnchainMutation,
  useCreateBlockProfilesTypedDataMutation,
  useCreateUnblockProfilesTypedDataMutation,
  useUnblockMutation
} from '@lensshare/lens';
import type { ApolloCache } from '@lensshare/lens/apollo';
import checkDispatcherPermissions from '@lensshare/lib/checkDispatcherPermissions';
import getProfile from '@lensshare/lib/getProfile';
import getSignature from '@lensshare/lib/getSignature';
import { Alert } from '@lensshare/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { type FC, useState } from 'react';
import { toast } from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useAppStore } from 'src/store/persisted/useAppStore';

import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { useContractWrite, useSignTypedData } from 'wagmi';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

const BlockOrUnBlockProfile: FC = () => {
  const { currentProfile } = useAppStore();
  const {
    showBlockOrUnblockAlert,
    setShowBlockOrUnblockAlert,
    blockingorUnblockingProfile
  } = useGlobalAlertStateStore();
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore();

  const [isLoading, setIsLoading] = useState(false);
  const [hasBlocked, setHasBlocked] = useState(
    blockingorUnblockingProfile?.operations.isBlockedByMe.value
  );

  const handleWrongNetwork = useHandleWrongNetwork();
  const { canUseLensManager, canBroadcast } =
    checkDispatcherPermissions(currentProfile);

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      id: `ProfileOperations:${blockingorUnblockingProfile?.id}`,
      fields: {
        isBlockedByMe: (existingValue) => {
          return { ...existingValue, value: !hasBlocked };
        }
      }
    });
  };

  const onCompleted = (
    __typename?: 'RelayError' | 'RelaySuccess' | 'LensProfileManagerRelayError'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return;
    }

    setIsLoading(false);
    setHasBlocked(!hasBlocked);
    setShowBlockOrUnblockAlert(false, null);
    toast.success(
      hasBlocked ? 'Blocked successfully!' : 'Unblocked successfully!'
    );
    
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'setBlockStatus',
    onSuccess: () => onCompleted(),
    onError
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });

  const typedDataGenerator = async (generatedData: any) => {
    const { id, typedData } = generatedData;
    const signature = await signTypedDataAsync(getSignature(typedData));
    setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);

    if (canBroadcast) {
      const { data } = await broadcastOnchain({
        variables: { request: { id, signature } }
      });
      if (data?.broadcastOnchain.__typename === 'RelayError') {
        return write({ args: [typedData.value] });
      }
      return;
    }

    return write({ args: [typedData.value] });
  };

  const [createBlockProfilesTypedData] =
    useCreateBlockProfilesTypedDataMutation({
      onCompleted: async ({ createBlockProfilesTypedData }) =>
        await typedDataGenerator(createBlockProfilesTypedData),
      onError,
      update: updateCache
    });

  const [createUnblockProfilesTypedData] =
    useCreateUnblockProfilesTypedDataMutation({
      onCompleted: async ({ createUnblockProfilesTypedData }) =>
        await typedDataGenerator(createUnblockProfilesTypedData),
      onError,
      update: updateCache
    });

  const [blockProfile] = useBlockMutation({
    onCompleted: ({ block }) => onCompleted(block.__typename),
    onError,
    update: updateCache
  });

  const [unBlockProfile] = useUnblockMutation({
    onCompleted: ({ unblock }) => onCompleted(unblock.__typename),
    onError,
    update: updateCache
  });

  const blockViaLensManager = async (request: BlockRequest) => {
    const { data } = await blockProfile({ variables: { request } });

    if (data?.block.__typename === 'LensProfileManagerRelayError') {
      return await createBlockProfilesTypedData({ variables: { request } });
    }
  };

  const unBlockViaLensManager = async (request: UnblockRequest) => {
    const { data } = await unBlockProfile({ variables: { request } });

    if (data?.unblock.__typename === 'LensProfileManagerRelayError') {
      return await createUnblockProfilesTypedData({ variables: { request } });
    }
  };

  const blockOrUnblock = async () => {
    if (!currentProfile) {
      return;
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setIsLoading(true);
      const request: BlockRequest | UnblockRequest = {
        profiles: [blockingorUnblockingProfile?.id]
      };

      // Block
      if (hasBlocked) {
        if (canUseLensManager) {
          return await unBlockViaLensManager(request);
        }

        return await createUnblockProfilesTypedData({
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request
          }
        });
      }

      // Unblock
      if (canUseLensManager) {
        return await blockViaLensManager(request);
      }

      return await createBlockProfilesTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Alert
      title="Block Profile"
      description={`Are you sure you want to ${
        hasBlocked ? 'un-block' : 'block'
      } ${getProfile(blockingorUnblockingProfile).slugWithPrefix}?`}
      confirmText={hasBlocked ? 'Unblock' : 'Block'}
      show={showBlockOrUnblockAlert}
      isDestructive
      isPerformingAction={isLoading}
      onConfirm={blockOrUnblock}
      onClose={() => setShowBlockOrUnblockAlert(false, null)}
    />
  );
};

export default BlockOrUnBlockProfile;
