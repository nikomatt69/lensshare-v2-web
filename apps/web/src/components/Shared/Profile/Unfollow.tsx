import { UserMinusIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@lensshare/abis';
import { LENSHUB_PROXY } from '@lensshare/data/constants';
import { PROFILE } from '@lensshare/data/tracking';
import type { Profile, UnfollowRequest } from '@lensshare/lens';
import {
  useBroadcastOnchainMutation,
  useCreateUnfollowTypedDataMutation,
  useUnfollowMutation
} from '@lensshare/lens';
import type { ApolloCache } from '@lensshare/lens/apollo';
import checkDispatcherPermissions from '@lensshare/lib/checkDispatcherPermissions';
import getSignature from '@lensshare/lib/getSignature';
import { Button, Spinner } from '@lensshare/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useAppStore } from 'src/store/useAppStore';
import { useGlobalModalStateStore } from 'src/store/useGlobalModalStateStore';
import { useNonceStore } from 'src/store/useNonceStore';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface UnfollowProps {
  profile: Profile;
  setFollowing: (following: boolean) => void;
  showText?: boolean;

  // For data analytics
  unfollowPosition?: number;
  unfollowSource?: string;
}

const Unfollow: FC<UnfollowProps> = ({
  profile,
  showText = false,
  setFollowing,
  unfollowPosition,
  unfollowSource
}) => {
  const { pathname } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore();
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const [isLoading, setIsLoading] = useState(false);
  const handleWrongNetwork = useHandleWrongNetwork();

  const { canUseLensManager, canBroadcast } =
    checkDispatcherPermissions(currentProfile);

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      id: cache.identify(profile.operations),
      fields: {
        isFollowedByMe: (existingValue) => {
          return { ...existingValue, value: false };
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
    setFollowing(false);
    toast.success('Unfollowed successfully!');

  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'unfollow',
    onSuccess: () => onCompleted(),
    onError
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });
  const [createUnfollowTypedData] = useCreateUnfollowTypedDataMutation({
    onCompleted: async ({ createUnfollowTypedData }) => {
      const { id, typedData } = createUnfollowTypedData;
      const signature = await signTypedDataAsync(getSignature(typedData));
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
      const { unfollowerProfileId, idsOfProfilesToUnfollow } = typedData.value;
      const args = [unfollowerProfileId, idsOfProfilesToUnfollow];

      if (canBroadcast) {
        const { data } = await broadcastOnchain({
          variables: { request: { id, signature } }
        });
        if (data?.broadcastOnchain.__typename === 'RelayError') {
          return write({ args });
        }
        return;
      }

      return write({ args });
    },
    onError,
    update: updateCache
  });

  const [unfollow] = useUnfollowMutation({
    onCompleted: ({ unfollow }) => onCompleted(unfollow.__typename),
    onError,
    update: updateCache
  });

  const unfollowViaLensManager = async (request: UnfollowRequest) => {
    const { data } = await unfollow({ variables: { request } });
    if (data?.unfollow?.__typename === 'LensProfileManagerRelayError') {
      return await createUnfollowTypedData({ variables: { request } });
    }
  };

  const createUnfollow = async () => {
    if (!currentProfile) {
      setShowAuthModal(true);
      return;
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setIsLoading(true);
      const request: UnfollowRequest = { unfollow: [profile?.id] };

      if (canUseLensManager) {
        return await unfollowViaLensManager(request);
      }

      return await createUnfollowTypedData({
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
    <Button
      className="!px-3 !py-1.5 text-sm"
      onClick={createUnfollow}
      disabled={isLoading}
      variant="danger"
      aria-label="Unfollow"
      icon={
        isLoading ? (
          <Spinner variant="danger" size="xs" />
        ) : (
          <UserMinusIcon className="h-4 w-4" />
        )
      }
      outline
    >
      {showText ? 'Following' : null}
    </Button>
  );
};

export default Unfollow;
