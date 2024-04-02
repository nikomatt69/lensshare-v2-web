import type {
  LastLoggedInProfileRequest,
  Profile,
  ProfileManagersRequest
} from '@lensshare/lens';
import type { FC } from 'react';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Errors } from '@lensshare/data/errors';
import { PROFILE } from '@lensshare/data/tracking';
import {
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useProfilesManagedQuery
} from '@lensshare/lens';
import getAvatar from '@lensshare/lib/getAvatar';
import getLennyURL from '@lensshare/lib/getLennyURL';
import getProfile from '@lensshare/lib/getProfile';
import { ErrorMessage, Image, Spinner } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { signIn, signOut } from 'src/store/persisted/useAuthStore';

import { useAccount, useSignMessage } from 'wagmi';

import { useAppStore } from 'src/store/persisted/useAppStore';
import Loader from '../Loader';

const SwitchProfiles: FC = () => {
  const { currentProfile } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loggingInProfileId, setLoggingInProfileId] = useState<null | string>(
    null
  );

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage({ onError });

  const request: LastLoggedInProfileRequest | ProfileManagersRequest = {
    for: address
  };
  const { data, error, loading } = useProfilesManagedQuery({
    variables: {
      lastLoggedInProfileRequest: request,
      profilesManagedRequest: request
    }
  });
  const [loadChallenge] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache'
  });
  const [authenticate] = useAuthenticateMutation();

  if (loading) {
    return <Loader message="Loading Profiles" />;
  }

  const profiles = data?.profilesManaged.items || [];

  const switchProfile = async (id: string) => {
    try {
      setLoggingInProfileId(id);
      setIsLoading(true);
      // Get challenge
      const challenge = await loadChallenge({
        variables: { request: { for: id, signedBy: address } }
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
      signOut();
      signIn({ accessToken, refreshToken });
      Leafwatch.track(PROFILE.SWITCH_PROFILE, { switch_profile_to: id });
      location.reload();
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto p-2">
      <ErrorMessage
        className="m-2"
        error={error}
        title="Failed to load profiles"
      />
      {profiles.map((profile: any, index: any) => (
        <button
          className="flex w-full cursor-pointer items-center justify-between space-x-2 rounded-lg py-3 pl-3 pr-4 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          key={profile?.id}
          onClick={async () => {
            const selectedProfile = profiles[index] as Profile;
            await switchProfile(selectedProfile.id);
          }}
          type="button"
        >
          <span className="flex items-center space-x-2">
            <Image
              alt={profile.id}
              className="w-6 h-6 rounded-full border dark:border-gray-700"
              height={20}
              onError={(currentTarget:any) => {
                currentTarget.src = getLennyURL(profile.id);
              }}
              src={getAvatar(profile)}
              width={20}
            />
            <div
              className={cn(
                currentProfile?.id === profile?.id && 'font-bold',
                'truncate'
              )}
            >
              {getProfile(profile as Profile).slugWithPrefix}
            </div>
          </span>
          {isLoading && profile.id === loggingInProfileId ? (
            <Spinner size="xs" />
          ) : currentProfile?.id === profile?.id ? (
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
          ) : null}
        </button>
      ))}
    </div>
  );
};

export default SwitchProfiles;
