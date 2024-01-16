import GlobalAlerts from '@components/Shared/GlobalAlerts';
import GlobalBanners from '@components/Shared/GlobalBanners';
import BottomNavigation from '@components/Shared/Navbar/BottomNavigation';
import type { Profile } from '@lensshare/lens';
import { useCurrentProfileQuery } from '@lensshare/lens';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import getToastOptions from '@lib/getToastOptions';
import Head from 'next/head';
import { useTheme } from 'next-themes';
import { useEffect, type FC, type ReactNode } from 'react';
import usePushSocket from 'src/hooks/messaging/push/usePushSocket';
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
import Script from 'next/script';
import { useRoom } from '@huddle01/react/hooks';
import SpacesWindow from './SpacesWindow/SpacesWindow';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';
import usePushNotificationSocket from '@components/messages2/Video/usePushNotificationSocket';
interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const resetPreferences = usePreferencesStore(
    (state) => state.resetPreferences
  );

  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );

  const resetPushChatStore = usePushChatStore(
    (state) => state.resetPushChatStore
  );

  const isMounted = useIsMounted();
  const { connector } = useAccount();
  const { disconnect } = useDisconnect();

  const currentSessionProfileId = getCurrentSessionProfileId();

  const logout = (reload = false) => {
    resetPreferences();
    signOut();
    disconnect?.();
    if (reload) {
      location.reload();
    }
  };
  const { isRoomJoined } = useRoom();
  const { loading } = useCurrentProfileQuery({
    variables: { request: { forProfileId: currentSessionProfileId } },
    skip: !currentSessionProfileId || isAddress(currentSessionProfileId),
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
      </Head>
      <Toaster
        position="bottom-right"
        containerStyle={{ wordBreak: 'break-word' }}
        toastOptions={getToastOptions(resolvedTheme)}
      />
      <GlobalModals />

      <GlobalAlerts />
      <div className="flex min-h-screen  flex-col pb-14 md:pb-0">
        <Navbar />
        {isRoomJoined ? <SpacesWindow /> : null}

        <GlobalBanners />
        <BottomNavigation />
        {children}
      </div>
    </>
  );
};

export default Layout;
