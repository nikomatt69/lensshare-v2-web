import GlobalAlerts from '@components/Shared/GlobalAlerts';
import GlobalBanners from '@components/Shared/GlobalBanners';
import BottomNavigation from '@components/Shared/Navbar/BottomNavigation';
import type { Profile } from '@lensshare/lens';
import { useCurrentProfileQuery } from '@lensshare/lens';
import getToastOptions from '@lib/getToastOptions';
import Head from 'next/head';
import { useTheme } from 'next-themes';
import { useEffect, type FC, type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from 'src/store/persisted/useAppStore';

import { useEffectOnce, useIsMounted } from 'usehooks-ts';
import { useAccount, useDisconnect } from 'wagmi';
import GlobalModals from '../Shared/GlobalModals';
import Loading from '../Shared/Loading';
import Navbar from '../Shared/Navbar';
import { isAddress } from 'viem';
import { useRoom } from '@huddle01/react/hooks';
import SpacesWindow from './SpacesWindow/SpacesWindow';
import { useRouter } from 'next/router';

import { useSpacesStore } from 'src/store/persisted/spaces';
import React from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet
} from 'react-native';
import getCurrentSession from '@lib/getCurrentSession';

import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { hydrateAuthTokens, signOut } from 'src/store/persisted/useAuthStore';
import useNotifictionSubscriptions from './Providers/useNotifictionSubscriptions';
import { useOaTransactionStore } from 'src/store/persisted/useOaTransactionStore';
import OaTransactionToaster from './OaTransactionToaster';
import { CachedConversation, useStreamMessages } from '@xmtp/react-sdk';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';
import { useIsClient } from '@uidotdev/usehooks';
interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const transactions = useOaTransactionStore((state) => state.transactions);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const { resolvedTheme } = useTheme();
  const { selectedConversation } = useMessagesStore();
  const { currentProfile, setCurrentProfile , setFallbackToCuratedFeed } = useAppStore();
  const { resetPreferences } = usePreferencesStore();

  const { setLensHubOnchainSigNonce } = useNonceStore();
  useRouter();

  const { connector } = useAccount();
;


  const { isRoomJoined } = useRoom();

  useEffectOnce(() => {
    // Listen for switch account in wallet and logout
    connector?.addListener('change', () => logout());
  });

 

  const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    scrollView: {
      flex: 1
    }
  });
  useSpacesStore();
  useEffectOnce(() => {
    validateAuthentication();
  });
  const GlobalHooks = () => {
    useNotifictionSubscriptions();
    useStreamMessages(selectedConversation?.peerAddress as unknown as CachedConversation)
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  };



  const isMounted = useIsClient();
  const { disconnect } = useDisconnect();

  const { id: sessionProfileId } = getCurrentSession();

  const logout = (reload = false) => {
    resetPreferences();

    signOut();
    disconnect?.();
    if (reload) {
      location.reload();
    }
  };

  const { loading } = useCurrentProfileQuery({
    onCompleted: ({ profile, userSigNonces }) => {
      setCurrentProfile(profile as Profile);
      setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce);

      // If the user has no following, we should fallback to the curated feed
      if (profile?.stats.followers === 0) {
        setFallbackToCuratedFeed(true);
      }
    },
    onError: () => logout(true),
    skip: !sessionProfileId || isAddress(sessionProfileId),
    variables: { request: { forProfileId: sessionProfileId } }
  });

  const validateAuthentication = () => {
    const { accessToken } = hydrateAuthTokens();

    if (!accessToken) {
      logout();
    }
  };

  useEffect(() => {
    validateAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const profileLoading = !currentProfile && loading;

  if (profileLoading || !isMounted) {
    return <Loading />;
  }


  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={resolvedTheme === 'dark' ? '#1b1b1d' : '#ffffff'}
        />

        <link rel="manifest" href="/manifest.json" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Toaster
        position="bottom-right"
        containerStyle={{ wordBreak: 'break-word' }}
        toastOptions={getToastOptions(resolvedTheme)}
      />
      
      <GlobalModals />
      <GlobalBanners />
      <GlobalHooks />
      <GlobalAlerts />
      <div className="flex min-h-screen  flex-col pb-14 md:pb-0">
        <SafeAreaView style={styles.container}>
          <Navbar />
          {transactions.map((tx) => (
          <OaTransactionToaster
          key={tx.txHash}
          onClose={() => {}}
          platformName={tx.platformName}
          txHash={tx.txHash}
          />
          ))}
          <ScrollView
            style={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {children}
          </ScrollView>
          {isRoomJoined ? <SpacesWindow /> : null}
          <BottomNavigation />
        </SafeAreaView>
      </div>
    </>
  );
};

export default Layout;

