import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { POLYGONSCAN_URL } from '@lensshare/data/constants';
import { useProfileQuery } from '@lensshare/lens';
import { Spinner } from '@lensshare/ui';
import Link from 'next/link';
import { type FC } from 'react';

import { useSignupStore } from '.';

const Minting: FC = () => {
  const setScreen = useSignupStore((state) => state.setScreen);
  const setProfileId = useSignupStore((state) => state.setProfileId);
  const choosedHandle = useSignupStore((state) => state.choosedHandle);
  const mintViaCard = useSignupStore((state) => state.mintViaCard);
  const transactionHash = useSignupStore((state) => state.transactionHash);

  useProfileQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data.profile) {
        setProfileId(data.profile.id);
        setScreen('success');
      }
    },
    pollInterval: 3000,
    skip: mintViaCard ? false : !transactionHash,
    variables: { request: { forHandle: choosedHandle } }
  });

  return (
    <div className="m-8 flex flex-col items-center justify-center">
      <div className="text-xl font-bold">We are preparing your profile!</div>
      <div className="ld-text-gray-500 mt-3 text-center font-semibold">
        This will take a few seconds to a few minutes. Please be patient.
      </div>
      <Spinner className="mt-8" />
      {!mintViaCard && (
        <Link
          className="mt-5 flex items-center space-x-1 text-sm underline"
          href={`${POLYGONSCAN_URL}/tx/${transactionHash}`}
          target="_blank"
        >
          <span>View transaction</span>
          <ArrowTopRightOnSquareIcon className="size-4" />
        </Link>
      )}
    </div>
  );
};

export default Minting;
