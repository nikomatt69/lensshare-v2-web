/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-undef */
import FullScreenModal from '@components/Bytes/FullScreenModal';
import {
  BellAlertIcon,
  BellSnoozeIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { WALLETCONNECT_PROJECT_ID } from '@lensshare/data/constants';
import {
  useManageSubscription,
  useSubscription,
  useW3iAccount,
  useInitWeb3InboxClient,
  useMessages
} from '@web3inbox/widget-react';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useSignMessage, useAccount } from 'wagmi';
type Props = {
  trigger: React.ReactNode;
};
const Push: FC<Props> = ({ trigger }) => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  

  // Initialize the Web3Inbox SDK
  const isReady = useInitWeb3InboxClient({
    // The project ID and domain you setup in the Domain Setup section
    projectId: `${WALLETCONNECT_PROJECT_ID}`,
    domain: 'mycrumbs.xyz',

    // Allow localhost development with "unlimited" mode.
    // This authorizes this dapp to control notification subscriptions for all domains (including `app.example.com`), not just `window.location.host`
    isLimited: false
  });

  const { account, setAccount, isRegistered, isRegistering, register } =
    useW3iAccount();
  useEffect(() => {
    if (!address) {
      return;
    }
    // Convert the address into a CAIP-10 blockchain-agnostic account ID and update the Web3Inbox SDK with it
    setAccount(`eip155:1:${address}`);
  }, [address, setAccount]);

  // In order to authorize the dapp to control subscriptions, the user needs to sign a SIWE message which happens automatically when `register()` is called.
  // Depending on the configuration of `domain` and `isLimited`, a different message is generated.
  const performRegistration = useCallback(async () => {
    if (!address) {
      return;
    }
    try {
      await register((message) => signMessageAsync({ message }));
    } catch (registerIdentityError) {
      alert(registerIdentityError);
    }
  }, [signMessageAsync, register, address]);

  useEffect(() => {
    // Register even if an identity key exists, to account for stale keys
    performRegistration();
  }, [performRegistration]);

  const { isSubscribed, isSubscribing, subscribe } = useManageSubscription();
  const [show, setShow] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [following, setFollowing] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const performSubscribe = useCallback(async () => {
    // Register again just in case
    await performRegistration();
    await subscribe();
  }, [subscribe, isRegistered]);

  const { subscription } = useSubscription();
  const { messages } = useMessages();

  return (
    <>
      {!isReady ? (
        <div>Loading client...</div>
      ) : (
        <>
          {!address ? (
            <div>Connect your wallet</div>
          ) : (
            <>
              {!isRegistered ? (
                <div>
                  Add Push key:&nbsp;
                  <button
                    onClick={performRegistration}
                    disabled={isRegistering}
                  >
                    {isRegistering ? 'Signing...' : 'Sign'}
                  </button>
                </div>
              ) : (
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <>
                  {!isSubscribed ? (
                    <button onClick={performSubscribe} disabled={isSubscribing}>
                      {isSubscribing ? (
                        'Subscribing...'
                      ) : (
                        <BellAlertIcon className="text-brand-700 h-5 w-5" />
                      )}
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="my-auto focus:outline-none"
                        onClick={() => setShow(true)}
                      >
                        <div className="lt-text-gray-500 flex items-center space-x-1 pr-3 font-bold">
                          <BellSnoozeIcon className="h-4 w-4" />
                        </div>
                        {trigger}
                      </button>
                      <FullScreenModal
                        panelClassName="max-w-lg bg-[#F2F6F9] dark:bg-black overflow-y-hidden overflow-y-auto rounded-xl lg:ml-9"
                        show={show}
                        autoClose
                      >
                        <div className="z-10 max-md:absolute">
                          <button
                            type="button"
                            className="m-4 rounded-full bg-slate-600 p-1  focus:outline-none"
                            onClick={() => setShow(false)}
                          >
                            <XCircleIcon className="h-4 w-4 text-white" />
                          </button>
                        </div>
                        <div className="center-items z-100 flex  w-full overflow-y-auto border-0 bg-white pt-10 dark:bg-gray-900/70">
                          <div>Messages: {JSON.stringify(messages)}</div>
                        </div>
                        {currentProfile ? (
                          <div>
                            Subscription: {JSON.stringify(subscription)}
                          </div>
                        ) : null}
                      </FullScreenModal>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
export default Push;
