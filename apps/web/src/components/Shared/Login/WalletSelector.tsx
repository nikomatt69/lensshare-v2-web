import {
  ArrowRightCircleIcon,
  KeyIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { Errors } from '@lensshare/data/errors';
import { AUTH } from '@lensshare/data/tracking';
import type {
  LastLoggedInProfileRequest,
  Profile,
  ProfileManagersRequest
} from '@lensshare/lens';
import {
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useProfilesManagedQuery
} from '@lensshare/lens';
import getWalletDetails from '@lensshare/lib/getWalletDetails';
import { Button, Card, Spinner } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CHAIN } from 'src/constants';
import { signIn } from 'src/store/useAuthPersistStore';
import { useIsMounted } from 'usehooks-ts';
import type { Connector } from 'wagmi';
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSignMessage
} from 'wagmi';

import UserProfile from '../UserProfile';
import { IS_MAINNET } from '@lensshare/data/constants';

interface WalletSelectorProps {
  setHasConnected?: Dispatch<SetStateAction<boolean>>;
  setShowSignup?: Dispatch<SetStateAction<boolean>>;
}

const WalletSelector: FC<WalletSelectorProps> = ({
  setHasConnected,
  setShowSignup
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loggingInProfileId, setLoggingInProfileId] = useState<string | null>(
    null
  );

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const isMounted = useIsMounted();
  const chain = useChainId();
  const {
    connectors,
    error,
    connectAsync,
    isLoading: isConnectLoading,
    pendingConnector
  } = useConnect({ chainId: CHAIN.id });

  const { disconnect } = useDisconnect();
  const { address, connector: activeConnector } = useAccount();
  const { signMessageAsync } = useSignMessage({ onError });
  const [loadChallenge, { error: errorChallenge }] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache'
  });
  const [authenticate, { error: errorAuthenticate }] =
    useAuthenticateMutation();
  const request: ProfileManagersRequest | LastLoggedInProfileRequest = {
    for: address
  };
  const { data: profilesManaged, loading: profilesManagedLoading } =
    useProfilesManagedQuery({
      variables: {
        profilesManagedRequest: request,
        lastLoggedInProfileRequest: request
      },
      skip: !address
    });

  const onConnect = async (connector: Connector) => {
    try {
      const account = await connectAsync({ connector });
      if (account) {
        setHasConnected?.(true);
      }
      Leafwatch.track(AUTH.CONNECT_WALLET, {
        wallet: connector.name.toLowerCase()
      });
    } catch {}
  };

  const handleSign = async (id?: string) => {
    try {
      setLoggingInProfileId(id || null);
      setIsLoading(true);
      // Get challenge
      const challenge = await loadChallenge({
        variables: {
          request: { ...(id && { for: id }), signedBy: address }
        }
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
      Leafwatch.track(AUTH.SIWL);
      location.reload();
    } catch {}
  };

  const allProfiles = profilesManaged?.profilesManaged.items || [];
  const lastLogin = profilesManaged?.lastLoggedInProfile;

  const remainingProfiles = lastLogin
    ? allProfiles.filter((profile) => profile.id !== lastLogin.id)
    : allProfiles;

  const profiles = lastLogin
    ? [lastLogin, ...remainingProfiles]
    : remainingProfiles;

  return activeConnector?.id ? (
    <div className="space-y-3">
      <div className="space-y-2.5">
        {chain === CHAIN.id ? (
          profilesManagedLoading ? (
            <Card className="w-full dark:divide-gray-700" forceRounded>
              <div className="space-y-2 p-4 text-center text-sm font-bold">
                <Spinner size="sm" className="mx-auto" />
                <div>Loading profiles managed by you...</div>
              </div>
            </Card>
          ) : profiles.length > 0 ? (
            <Card className="w-full dark:divide-gray-700" forceRounded>
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-3"
                >
                  <UserProfile
                    linkToProfile={false}
                    showUserPreview={false}
                    profile={profile as Profile}
                  />
                  <Button
                    onClick={() => handleSign(profile.id)}
                    icon={
                      isLoading && loggingInProfileId === profile.id ? (
                        <Spinner size="xs" />
                      ) : (
                        <ArrowRightCircleIcon className="h-4 w-4" />
                      )
                    }
                    disabled={isLoading && loggingInProfileId === profile.id}
                  >
                    Login
                  </Button>
                </div>
              ))}
            </Card>
          ) : (
            <div>
              <Button
                onClick={() => handleSign()}
                icon={
                  isLoading ? (
                    <Spinner size="xs" />
                  ) : (
                    <ArrowRightCircleIcon className="h-4 w-4" />
                  )
                }
                disabled={isLoading}
              >
                Sign in with Lens
              </Button>
            </div>
          )
        ) : (
          profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between p-3"
            >
              <UserProfile
                linkToProfile={false}
                showUserPreview={false}
                profile={profile as Profile}
              />
              <Button
                onClick={() => handleSign(profile.id)}
                icon={
                  isLoading && loggingInProfileId === profile.id ? (
                    <Spinner size="xs" />
                  ) : (
                    <ArrowRightCircleIcon className="h-4 w-4" />
                  )
                }
                disabled={isLoading && loggingInProfileId === profile.id}
              >
                Login
              </Button>
            </div>
          ))
        )}
        {!IS_MAINNET && (
          <button
            onClick={() => {
              setShowSignup?.(true);
            }}
            className="flex items-center space-x-1 text-sm underline"
          >
            <UserPlusIcon className="h-4 w-4" />
            <div>Create a testnet account</div>
          </button>
        )}
        <button
          onClick={() => {
            disconnect?.();
            Leafwatch.track(AUTH.CHANGE_WALLET);
          }}
          className="flex items-center space-x-1 text-sm underline"
        >
          <KeyIcon className="h-4 w-4" />
          <div>Change wallet</div>
        </button>
      </div>
      {errorChallenge || errorAuthenticate ? (
        <div className="flex items-center space-x-1 font-bold text-red-500">
          <XCircleIcon className="h-5 w-5" />
          <div>{Errors.SomethingWentWrong}</div>
        </div>
      ) : null}
    </div>
  ) : (
    <div className="inline-block w-full space-y-3 overflow-hidden text-left align-middle">
      {connectors.map((connector) => {
        return (
          <button
            type="button"
            key={connector.id}
            className={cn(
              {
                'hover:bg-gray-100 dark:hover:bg-gray-700':
                  connector.id !== activeConnector?.id
              },
              'flex w-full items-center justify-between space-x-2.5 overflow-hidden rounded-xl border px-4 py-3 outline-none dark:border-gray-700'
            )}
            onClick={() => onConnect(connector)}
            disabled={
              isMounted()
                ? !connector.ready || connector.id === activeConnector?.id
                : false
            }
          >
            <span>
              {isMounted()
                ? connector.id === 'injected'
                  ? 'Browser Wallet'
                  : getWalletDetails(connector.name).name
                : getWalletDetails(connector.name).name}
            </span>
            <div className="flex items-center space-x-4">
              {isConnectLoading && pendingConnector?.id === connector.id ? (
                <Spinner className="mr-0.5" size="xs" />
              ) : null}
              <img
                src={getWalletDetails(connector.name).logo}
                draggable={false}
                className="h-6 w-6"
                height={24}
                width={24}
                alt={connector.id}
              />
            </div>
          </button>
        );
      })}
      {error?.message ? (
        <div className="flex items-center space-x-1 text-red-500">
          <XCircleIcon className="h-5 w-5" />
          <div>{error?.message ?? 'Failed to connect'}</div>
        </div>
      ) : null}
    </div>
  );
};

export default WalletSelector;
