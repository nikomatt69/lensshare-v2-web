
import { AUTH } from '@lensshare/data/tracking';
import { useAuthenticateMutation, useChallengeLazyQuery } from '@lensshare/lens';
import { Button, Spinner } from '@lensshare/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';
import { signIn } from 'src/store/persisted/useAuthStore';
import { useAccount, useSignMessage } from 'wagmi';

import { useSignupStore } from '.';
import { Errors } from '@lensshare/data/errors';

const Success: FC = () => {
  const profileId = useSignupStore((state) => state.profileId);
  const [isLoading, setIsLoading] = useState(false);

  const { address } = useAccount();

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signMessageAsync } = useSignMessage({ onError  });

  const [loadChallenge] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache'
  });
  const [authenticate] = useAuthenticateMutation();

  const handleSign = async () => {
    try {
      setIsLoading(true);
      // Get challenge
      const challenge = await loadChallenge({
        variables: { request: { for: profileId, signedBy: address } }
      });

      if (!challenge?.data?.challenge?.text) {
        return toast.error(Errors.SomethingWentWrong);
      }

      // Get signature
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      });

      // Auth user and set cookies
      const auth = await authenticate({
        variables: { request: { id: challenge.data.challenge.id, signature } }
      });
      const accessToken = auth.data?.authenticate.accessToken;
      const refreshToken = auth.data?.authenticate.refreshToken;
      signIn({ accessToken, refreshToken });
      Leafwatch.track(AUTH.LOGIN, { profile_id: profileId, source: 'signup' });
      location.reload();
    } catch {}
  };

  return (
    <div className="m-8 flex flex-col items-center justify-center">
      <div className="text-xl font-bold">Waaa-hey! You got your profile!</div>
      <div className="ld-text-gray-500 mt-3 text-center font-semibold">
        Welcome to decentralised social where everything is sooooooooooooo much
        better! 🎉
      </div>
     
      <Button
        className="mt-5"
        disabled={isLoading}
        icon={
          isLoading ? (
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
        onClick={handleSign}
      >
        Sign in with Lens
      </Button>
    </div>
  );
};

export default Success;
