import GlobalAlerts from '@components/Shared/GlobalAlerts';
import GlobalBanners from '@components/Shared/GlobalBanners';
import BottomNavigation from '@components/Shared/Navbar/BottomNavigation';
import type { Profile } from '@lensshare/lens';
import { useCurrentProfileQuery } from '@lensshare/lens';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import getToastOptions from '@lib/getToastOptions';
import Head from 'next/head';
import { useTheme } from 'next-themes';
import { type FC, type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from 'src/store/useAppStore';
import { hydrateAuthTokens, signOut } from 'src/store/useAuthPersistStore';
import { useNonceStore } from 'src/store/useNonceStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';
import { useEffectOnce, useIsMounted } from 'usehooks-ts';
import { useAccount, useDisconnect } from 'wagmi';
import GlobalModals from '../Shared/GlobalModals';
import Loading from '../Shared/Loading';
import Navbar from '../Shared/Navbar';
import { isAddress } from 'viem';
import { useRoom } from '@huddle01/react/hooks';
import SpacesWindow from './SpacesWindow/SpacesWindow';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';
import { useRouter } from 'next/router';
import { useDisconnectXmtp } from 'src/hooks/useXmtpClient';
import { useSpacesStore } from 'src/store/persisted/spaces';
import React from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet
} from 'react-native';
import getCurrentSession from '@lib/getCurrentSession';
interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const { resolvedTheme } = useTheme();
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const resetPreferences = usePreferencesStore(
    (state) => state.resetPreferences
  );
  const { pathname } = useRouter();

  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );

  const resetPushChatStore = usePushChatStore(
    (state) => state.resetPushChatStore
  );

  const isMounted = useIsMounted();
  const { connector } = useAccount();
  const { disconnect } = useDisconnect();
  const disconnectXmtp = useDisconnectXmtp();
  const { id: sessionProfileId } = getCurrentSession();

  const logout = (reload = false) => {
    resetPreferences();
    signOut();
    disconnectXmtp();
    disconnect?.();
    if (reload) {
      location.reload();
    }
  };
  const { isRoomJoined } = useRoom();
  const { loading } = useCurrentProfileQuery({
    variables: { request: { forProfileId: sessionProfileId } },
    skip: !sessionProfileId || isAddress(sessionProfileId),
    onCompleted: ({ profile, userSigNonces }) => {
      setCurrentProfile(profile as Profile);
      setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce);
    }
  });

  useEffectOnce(() => {
    // Listen for switch account in wallet and logout
    connector?.addListener('change', () => logout());
  });

  const validateAuthentication = () => {
    const { accessToken } = hydrateAuthTokens();
    if (!accessToken) {
      logout();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    scrollView: {
      flex: 1
    }
  });
  const { showSpacesLobby, showSpacesWindow } = useSpacesStore();
  useEffectOnce(() => {
    validateAuthentication();
  });

  const profileLoading = !currentProfile && loading;

  if (profileLoading || !isMounted()) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={resolvedTheme === 'dark' ? '#1b1b1d' : '#ffffff'}
        />

        <link
          rel="manifest"
          href="https://progressier.app/B5LgRYtk8D553Rd2UvFW/progressier.json"
        />
        <script
          defer
          src="https://progressier.app/B5LgRYtk8D553Rd2UvFW/script.js"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Toaster
        position="bottom-right"
        containerStyle={{ wordBreak: 'break-word' }}
        toastOptions={getToastOptions(resolvedTheme)}
      />
      <GlobalModals />
      <GlobalBanners />
      <GlobalAlerts />
      <div className="flex min-h-screen  flex-col pb-14 md:pb-0">
        <SafeAreaView style={styles.container}>
          <Navbar />
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
