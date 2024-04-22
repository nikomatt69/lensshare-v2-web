import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@lensshare/abis';
import { LENSHUB_PROXY } from '@lensshare/data/constants';
import { Errors } from '@lensshare/data/errors';
import { Regex } from '@lensshare/data/regex';
import { SETTINGS } from '@lensshare/data/tracking';
import {
  ChangeProfileManagerActionType,
  useBroadcastOnchainMutation,
  useCreateChangeProfileManagersTypedDataMutation
} from '@lensshare/lens';
import checkDispatcherPermissions from '@lensshare/lib/checkDispatcherPermissions';
import getSignature from '@lensshare/lib/getSignature';
import { Button, Form, Input, Spinner, useZodForm } from '@lensshare/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useAppStore } from 'src/store/persisted/useAppStore';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { useContractWrite, useSignTypedData } from 'wagmi';
import { object, string } from 'zod';
import { hydrateTbaStatus } from '@lensshare/web/src/store/persisted/useTbaStatusStore';

const newProfileManagerSchema = object({
  manager: string()
    .max(42, { message: 'Ethereum address should be within 42 characters' })
    .regex(Regex.ethereumAddress, { message: 'Invalid Ethereum address' })
});

interface AddProfileManagerProps {
  setShowAddManagerModal: (show: boolean) => void;
}

const AddProfileManager: FC<AddProfileManagerProps> = ({
  setShowAddManagerModal
}) => {
  const { currentProfile } = useAppStore();
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore();
  const [isLoading, setIsLoading] = useState(false);
  const { isTba } = hydrateTbaStatus();

  const handleWrongNetwork = useHandleWrongNetwork();
  const { canBroadcast } = checkDispatcherPermissions(currentProfile);

  const form = useZodForm({
    schema: newProfileManagerSchema
  });

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return;
    }

    setIsLoading(false);
    setShowAddManagerModal(false);
    form.reset();
    toast.success('Manager added successfully!');
  
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'changeDelegatedExecutorsConfig',
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
  const [createChangeProfileManagersTypedData] =
    useCreateChangeProfileManagersTypedDataMutation({
      onCompleted: async ({ createChangeProfileManagersTypedData }) => {
        const { id, typedData } = createChangeProfileManagersTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
        const {
          delegatorProfileId,
          delegatedExecutors,
          approvals,
          configNumber,
          switchToGivenConfig
        } = typedData.value;
        const args = [
          delegatorProfileId,
          delegatedExecutors,
          approvals,
          configNumber,
          switchToGivenConfig
        ];

        if (!isTba && canBroadcast) {
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

  const addManager = async (manager: string) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setIsLoading(true);
      return await createChangeProfileManagersTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: {
            changeManagers: [
              { address: manager, action: ChangeProfileManagerActionType.Add }
            ]
          }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Form
      form={form}
      className="space-y-4 p-5"
      onSubmit={async ({ manager }) => {
        await addManager(manager);
      }}
    >
      <div>
        <Input
          label="Manager address"
          type="text"
          placeholder="0x3A5bd...5e3"
          {...form.register('manager')}
        />
      </div>
      <div className="ml-auto">
        <div className="block space-x-0 space-y-2 sm:flex sm:space-x-2 sm:space-y-0">
          <Button
            type="submit"
            disabled={isLoading}
            icon={
              isLoading ? (
                <Spinner size="xs" />
              ) : (
                <PlusCircleIcon className="h-4 w-4" />
              )
            }
          >
            Add manager
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default AddProfileManager;
