/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@lensshare/abis';
import {
  DEFAULT_COLLECT_TOKEN,
  LENSHUB_PROXY
} from '@lensshare/data/constants';
import { Errors } from '@lensshare/data/errors';
import { Regex } from '@lensshare/data/regex';
import { SETTINGS } from '@lensshare/data/tracking';
import type { Erc20 } from '@lensshare/lens';
import {
  FollowModuleType,
  LimitType,
  useBroadcastOnchainMutation,
  useCreateSetFollowModuleTypedDataMutation,

} from '@lensshare/lens';
import checkDispatcherPermissions from '@lensshare/lib/checkDispatcherPermissions';
import getSignature from '@lensshare/lib/getSignature';
import getTokenImage from '@lensshare/lib/getTokenImage';
import { Button, Card, Form, Input, Select, Spinner, useZodForm } from '@lensshare/ui';
import getAllTokens from '@lib/api/getAllTokens';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useAppStore } from 'src/store/useAppStore';
import { useNonceStore } from 'src/store/useNonceStore';
import { useContractWrite, useSignTypedData } from 'wagmi';
import { object, string } from 'zod';

const newSuperFollowSchema = object({
  amount: string().min(1, { message: 'Invalid amount' }),
  recipient: string()
    .max(42, { message: 'Ethereum address should be within 42 characters' })
    .regex(Regex.ethereumAddress, { message: 'Invalid Ethereum address' })
});

const SuperFollow: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(
    DEFAULT_COLLECT_TOKEN
  );
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] =
    useState('WMATIC');
  const handleWrongNetwork = useHandleWrongNetwork();
  const { canBroadcast } = checkDispatcherPermissions(currentProfile);

  const form = useZodForm({
    schema: newSuperFollowSchema,
    defaultValues: {
      recipient: currentProfile?.ownedBy.address
    }
  });

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return;
    }

    setIsLoading(false);
    toast.success('Super follow updated successfully!');
    
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({
    onError
  });
  const { data: allowedTokens, isLoading: allowedTokensLoading } = useQuery({
    queryFn: () => getAllTokens(),
    queryKey: ['getAllTokens']
  });


  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'setFollowModule',
    onSuccess: () => {
      onCompleted();
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
    },
    onError: (error) => {
      onError(error);
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1);
    }
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });
  const [createSetFollowModuleTypedData] =
    useCreateSetFollowModuleTypedDataMutation({
      onCompleted: async ({ createSetFollowModuleTypedData }) => {
        const { id, typedData } = createSetFollowModuleTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { profileId, followModule, followModuleInitData } =
          typedData.value;
        const args = [profileId, followModule, followModuleInitData];

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
      onError
    });

  const setSuperFollow = async (
    amount: string | null,
    recipient: string | null
  ) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setIsLoading(true);
      return await createSetFollowModuleTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: {
            followModule: amount
              ? {
                  feeFollowModule: {
                    amount: { currency: selectedCurrency, value: amount },
                    recipient
                  }
                }
              : { freeFollowModule: true }
          }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  if (allowedTokensLoading) {
    return (
      <Card>
        <div className="space-y-2 p-5 py-10 text-center">
          <Spinner className="mx-auto" size="md" />
          <div>Loading Super follow settings</div>
        </div>
      </Card>
    );
  }
  const followType = currentProfile?.followModule?.type;

  return (
    <Card>
      <Form
        form={form}
        className="space-y-4 p-5"
        onSubmit={async ({ amount, recipient }) => {
          await setSuperFollow(amount, recipient);
        }}
      >
        <div className="text-lg font-bold">Set Super follow</div>
        <p>
          Setting Super follow makes users spend crypto to follow you, and it's
          a good way to earn it, you can change the amount and currency or
          disable/enable it anytime.
        </p>
        <div className="pt-2">
          <div className="label">Select currency</div>
          <Select
            defaultValue={
              currentProfile?.followModule?.__typename ===
              'FeeFollowModuleSettings'
                ? currentProfile?.followModule?.amount.asset.contract.address
                : undefined
            }
            onChange={(e) => setSelectedCurrency(e.target.value)}
            options={allowedTokens?.map((token) => ({
              label: token.name,
              value: token.contractAddress
            }))}
          />
        </div>
        <Input
          label="Follow amount"
          type="number"
          step="0.0001"
          min="0"
          max="100000"
          prefix={
            <img
              className="h-6 w-6"
              height={24}
              width={24}
              src={getTokenImage(selectedCurrencySymbol)}
              alt={selectedCurrencySymbol}
            />
          }
          placeholder="5"
          {...form.register('amount')}
        />
        <Input
          label="Funds recipient"
          type="text"
          placeholder="0x3A5bd...5e3"
          {...form.register('recipient')}
        />
        <div className="ml-auto">
          <div className="block space-x-0 space-y-2 sm:flex sm:space-x-2 sm:space-y-0">
            {followType === FollowModuleType.FeeFollowModule ? (
              <Button
                type="button"
                variant="danger"
                outline
                onClick={() => setSuperFollow(null, null)}
                disabled={isLoading}
                icon={<XMarkIcon className="h-4 w-4" />}
              >
                Disable Super follow
              </Button>
            ) : null}
            <Button
              type="submit"
              disabled={isLoading}
              icon={<StarIcon className="h-4 w-4" />}
            >
              {followType === FollowModuleType.FeeFollowModule
                ? 'Update Super follow'
                : 'Set Super follow'}
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default SuperFollow;
