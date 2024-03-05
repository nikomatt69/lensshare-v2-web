import { useState } from 'react';
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction
} from 'wagmi';
import { parseEther } from 'ethers/lib/utils';
import { Button, Input } from '@lensshare/ui';
import { useSignupStore } from '.';
import { useProfileQuery } from '@lensshare/lens';
import { CheckIcon, FaceFrownIcon } from '@heroicons/react/24/outline';
import {
  APP_NAME,
  HANDLE_PREFIX,
  HEY_LENS_SIGNUP
} from '@lensshare/data/constants';

// Assuming HeyLensSignupABI is imported or defined elsewhere in your project

import { HeyLensSignup } from '@lensshare/abis';
import { any } from 'zod';

const ChooseHandle = () => {
  const setScreen = useSignupStore((state) => state.setScreen);
  const [handle, setHandle] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const value = BigInt(parseEther('1').toString());
  // Prepare contract write operation
  const { config } = usePrepareContractWrite({
    address: HEY_LENS_SIGNUP, // The contract address
    abi: HeyLensSignup, // ABI of the contract
    functionName: 'createProfileWithHandleUsingCredits',
    args: [
      [
        '0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF',
        '0x0000000000000000000000000000000000000000',
        '0x'
      ],
      handle,
      ['0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF']
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

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="text-xl font-bold">Welcome to {APP_NAME}!</div>
        <div className="ld-text-gray-500 text-sm">
          Let's start by choosing your handle. Handles cost a little bit of
          money to support the network and keep bots away.
        </div>
      </div>
      <div className="space-y-5 pt-3">
        <div className="mb-5">
          <Input
            onChange={(e) => setHandle(e.target.value)}
            placeholder="yourhandle"
            prefix="@lens/"
          />
          {isAvailable === false ? (
            <div className="mt-2 flex items-center space-x-1 text-sm text-red-500">
              <FaceFrownIcon className="size-4" />
              <b>Handle not available!</b>
            </div>
          ) : isAvailable === true ? (
            <div className="mt-2 flex items-center space-x-1 text-sm text-green-500">
              <CheckIcon className="size-4" />
              <b>You're in luck - it's available!</b>
            </div>
          ) : null}
        </div>
        <Button
          className="w-full"
          disabled={!handle || isWriteLoading || isAvailable !== true}
          onClick={handleMint}
        >
          Mint for 1 ETH
        </Button>
      </div>
    </div>
  );
};

export default ChooseHandle;
