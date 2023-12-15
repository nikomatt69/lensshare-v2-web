import { Localstorage } from '@lensshare/data/storage';

import { Client } from '@xmtp/xmtp-js';
import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useMessageStore } from 'src/store/message';
import { APP_NAME, APP_VERSION, XMTP_ENV } from '@lensshare/data/constants';

import { useWalletClient } from 'wagmi';

const ENCODING = 'binary';

const buildLocalStorageKey = (walletAddress: string) =>
  `xmtp:${XMTP_ENV}:keys:${walletAddress}`;

const loadKeys = (walletAddress: string): Uint8Array | null => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress));
  return val ? Buffer.from(val, ENCODING) : null;
};

/**
 * Anyone copying this code will want to be careful about leakage of sensitive keys.
 * Make sure that there are no third party services, such as bug reporting SDKs or ad networks, exporting the contents
 * of your LocalStorage before implementing something like this.
 */
const storeKeys = (walletAddress: string, keys: Uint8Array) => {
  localStorage.setItem(
    buildLocalStorageKey(walletAddress),
    Buffer.from(keys).toString(ENCODING)
  );
};

/**
 * This will clear the conversation cache + the private keys
 */
const wipeKeys = (walletAddress: string) => {
  localStorage.removeItem(buildLocalStorageKey(walletAddress));
};

const useXmtpClient = (cacheOnly = false) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const client = useMessageStore((state) => state.client);
  const setClient = useMessageStore((state) => state.setClient);
  const [awaitingXmtpAuth, setAwaitingXmtpAuth] = useState<boolean>();

  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    const initXmtpClient = async () => {
      if (walletClient && !client && currentProfile?.handle) {
        let keys = loadKeys(await walletClient.account.address);
        if (!keys) {
          if (cacheOnly) {
            return;
          }
          setAwaitingXmtpAuth(true);
          keys = await Client.getKeys(walletClient, {
            env: XMTP_ENV,
            appVersion: APP_NAME + '/' + APP_VERSION,
            persistConversations: false,
            skipContactPublishing: true
          });
          storeKeys(await walletClient.account.address, keys);
        }

        const xmtp = await Client.create(null, {
          env: XMTP_ENV,
          appVersion: APP_NAME + '/' + APP_VERSION,
          privateKeyOverride: keys,
          persistConversations: true
        });

        setClient(xmtp);
        setAwaitingXmtpAuth(false);
      } else {
        setAwaitingXmtpAuth(false);
      }
    };
    initXmtpClient();
    if (!walletClient || !currentProfile?.handle) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      setClient(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile?.handle]);

  return {
    client: client,
    loading: awaitingXmtpAuth
  };
};

export const useDisconnectXmtp = () => {
  const { data: walletClient } = useWalletClient();
  const client = useMessageStore((state) => state.client);
  const setClient = useMessageStore((state) => state.setClient);

  const disconnect = useCallback(async () => {
    if (walletClient) {
      wipeKeys(await walletClient.account.address);
    }
    if (client) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      setClient(undefined);
    }
    localStorage.removeItem(Localstorage.MessageStore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletClient, client]);

  return disconnect;
};

export default useXmtpClient;
