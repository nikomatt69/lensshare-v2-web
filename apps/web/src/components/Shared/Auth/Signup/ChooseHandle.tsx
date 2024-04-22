import { useState } from 'react';
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
  useBalance
} from 'wagmi';
import { parseEther } from 'ethers/lib/utils';
import { Button, Form, Input, Spinner, useZodForm } from '@lensshare/ui';
import { useSignupStore } from '.';
import { useProfileQuery } from '@lensshare/lens';
import {
  CheckIcon,
  ExclamationTriangleIcon,
  FaceFrownIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline';
import {
  APP_NAME,
  HANDLE_PREFIX,
  HEY_LENS_SIGNUP,
  SIGNUP_PRICE
} from '@lensshare/data/constants';

import { HeyLensSignup } from '@lensshare/abis';
import { object, string } from 'zod';
import AuthMessage from '../AuthMessage';
import { Regex } from '@lensshare/data/regex';
import { formatUnits } from 'viem';
import { Leafwatch } from '@lib/leafwatch';
import { AUTH } from '@lensshare/data/tracking';
import urlcat from 'urlcat';

declare global {
  interface Window {
    createLemonSqueezy: any;
    LemonSqueezy: {
      Setup: ({ eventHandler }: { eventHandler: any }) => void;
      Url: {
        Close: () => void;
        Open: (checkoutUrl: string) => void;
      };
    };
  }
}

export const SignupMessage = () => (
  <AuthMessage
    description="Let's start by buying your handle for you. Buying you say? Yep - handles cost a little bit of money to support the network and keep bots away"
    title={`Welcome to ${APP_NAME}!`}
  />
);

const newProfileSchema = object({
  handle: string()
    .min(5, { message: 'Handle must be at least 5 characters long' })
    .max(26, { message: 'Handle must be at most 26 characters long' })
    .regex(Regex.handle, {
      message:
        'Handle must start with a letter/number, only _ allowed in between'
    })
});

// Assuming HeyLensSignupABI is imported or defined elsewhere in your project
const ChooseHandle = () => {
  const setScreen = useSignupStore((state) => state.setScreen);
  const value = BigInt(parseEther('1').toString());
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const { data: balanceData } = useBalance({
    address
  });
  const form = useZodForm({ mode: 'onChange', schema: newProfileSchema });
  const handle = form.watch('handle');

  const balance = balanceData && parseFloat(formatUnits(balanceData.value, 18));
  const hasBalance = balance && balance >= SIGNUP_PRICE;
  const canCheck = Boolean(handle && handle.length > 4);
  const isInvalid = !form.formState.isValid;
  const setChoosedHandle = useSignupStore((state) => state.setChoosedHandle);
  // Prepare contract write operation
  const { config } = usePrepareContractWrite({
    address: HEY_LENS_SIGNUP, // The contract address
    abi: HeyLensSignup, // ABI of the contract
    functionName: 'createProfileWithHandleUsingCredits',
    args: [
      [
        '0x4b8845ACb8148dE64D1D99Cf27A3890a91F55E53',
        '0x0000000000000000000000000000000000000000',
        '0x'
      ],
      handle,
      ['0x4b8845ACb8148dE64D1D99Cf27A3890a91F55E53']
    ],

    value
  });

  // Execute contract write operation
  const {
    write,
    data: writeData,
    isLoading: isWriteLoading
  } = useContractWrite(config);

  // Wait for transaction to be mined
  useWaitForTransaction({
    hash: writeData?.hash,
    onSuccess(data) {
      console.log('Transaction successful:', data);
      setScreen('minting');
    }
  });

  // Example profile query (adjust according to actual implementation)
  useProfileQuery({
    fetchPolicy: 'no-cache',
    onCompleted: (data) => setIsAvailable(!data.profile),
    variables: { request: { forHandle: `${HANDLE_PREFIX}${handle}` } }
  });

  const handleMint = async () => {
    if (write) {
      write();
    }
  };

  const eventHandler = ({ event }: { data: any; event: any }) => {
    if (event === 'Checkout.Success' && window.LemonSqueezy) {
      Leafwatch.track(AUTH.LOGIN, { price: SIGNUP_PRICE, via: 'card' });

      setChoosedHandle(`${HANDLE_PREFIX}${handle.toLowerCase()}`);
      setScreen('minting');

      window.LemonSqueezy?.Url?.Close();
    }
  };

  
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="text-xl font-bold">Welcome to {APP_NAME}!</div>
        <div className="ld-text-gray-500 text-sm">
          Let's start by choosing your handle. Handles cost a little bit of
          money to support the network and keep bots away.
        </div>
      </div>
      <SignupMessage />
      <Form
        className="space-y-5 pt-3"
        form={form}
        onSubmit={async ({ handle }) => await handleMint}
      >
        <div className="mb-5">
          <Input
            placeholder="yourhandle"
            prefix="@lens/"
            {...form.register('handle')}
          />
          {canCheck && !isInvalid ? (
            isAvailable === false ? (
              <div className="mt-2 flex items-center space-x-1 text-sm text-red-500">
                <FaceFrownIcon className="h-4 w-4" />
                <b>Handle not available!</b>
              </div>
            ) : isAvailable === true ? (
              <div className="mt-2 flex items-center space-x-1 text-sm text-green-500">
                <CheckIcon className="h-4 w-4" />
                <b>You're in luck - it's available!</b>
              </div>
            ) : null
          ) : canCheck && isInvalid ? (
            <div className="mt-2 flex items-center space-x-1 text-sm text-red-500">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <b>{form.formState.errors.handle?.message}</b>
            </div>
          ) : (
            <div className="ld-text-gray-500 mt-2 flex items-center space-x-1 text-sm">
              <FaceSmileIcon className="h-4 w-4" />
              <b>Hope you will get a good one!</b>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {hasBalance ? (
            <Button
              className="w-full justify-center"
              icon={
                loading ? (
                  <Spinner className="mr-0.5" size="xs" />
                ) : (
                  <img
                    alt="Lens Logo"
                    className="h-3"
                    height={12}
                    src="/lens.svg"
                    width={19}
                  />
                )
              }
              type="submit"
            >
              Mint for {SIGNUP_PRICE} MATIC
            </Button>
          ) : (
            `Invalid Funds`
          )}
        </div>
      </Form>
    </div>
  );
};

export default ChooseHandle;
