import { Modal, Image } from '@lensshare/ui';
import React from 'react';
import MetaTags from './MetaTags';
import { APP_NAME, STATIC_ASSETS_URL } from '@lensshare/data/constants';
import { useTheme } from 'next-themes';
const PWAInstallPrompt = () => {
  const { resolvedTheme } = useTheme();
  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  const isInStandaloneMode = () =>
    'standalone' in window.navigator && window.navigator['standalone'];

  if (isIos() && !isInStandaloneMode()) {
    return (
      <Modal show={true}>
        <div className="page-center flex-col gap-5">
          <div className="ios-pwa-prompt items-center justify-center text-center">
            <MetaTags title={`Pwa • ${APP_NAME}`} />
            <div className="items-center justify-center text-center text-xl">
              {resolvedTheme === 'dark' ? (
                <Image
                  className="cursor-pointer"
                  src={`${STATIC_ASSETS_URL}/images/Lenstoknewlogo3.png`}
                  alt="logo"
                />
              ) : (
                <Image
                  className="cursor-pointer"
                  src={`${STATIC_ASSETS_URL}/images/Lenstoknewlogo.png`}
                  alt="logo"
                />
              )}
              Install MyCrumbs as a Pwa, tap the MyCrumbs icon at the bottom
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return null;
};

export default PWAInstallPrompt;
