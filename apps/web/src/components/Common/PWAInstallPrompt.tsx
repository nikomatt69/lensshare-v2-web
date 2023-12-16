import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';
import { Modal } from '@lensshare/ui';
import React from 'react';
import MetaTags from './MetaTags';
import { APP_NAME, STATIC_ASSETS_URL } from '@lensshare/data/constants';

const PWAInstallPrompt = () => {
  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  const isInStandaloneMode = () =>
    'standalone' in window.navigator && window.navigator['standalone'];

  if (isIos() && !isInStandaloneMode()) {
    return (
      <Modal show={true}>
        <div className="page-center gap 5 flex-col">
          <div className="ios-pwa-prompt">
            <MetaTags title={`Pwa • ${APP_NAME}`} />
            <h1 className="items-center justify-center text-center text-xl">
              LensShare
            </h1>
            <img
              src={`${STATIC_ASSETS_URL}/images/icon.png`}
              alt="Icon"
              className="h-60"
              height={240}
            />
            Install LensShare as a Pwa, tap
            <ArrowUpOnSquareIcon className=" text-brand-700 h-6 w-6 cursor-pointer" />
            and then 'Add to Home Screen'
          </div>
        </div>
      </Modal>
    );
  }

  return null;
};

export default PWAInstallPrompt;
