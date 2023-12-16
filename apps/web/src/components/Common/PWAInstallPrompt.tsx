import { ArrowUpOnSquareIcon, XCircleIcon } from '@heroicons/react/24/outline';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import React from 'react';

const PWAInstallPrompt = () => {
  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  const isInStandaloneMode = () =>
    'standalone' in window.navigator && window.navigator['standalone'];

  if (isIos() && !isInStandaloneMode()) {
    return (
      <div className="ios-pwa-prompt">
        To install this app, tap{' '}
        <ArrowUpOnSquareIcon className=" text-brand-700 h-4 w-4 cursor-pointer" />{' '}
        and then 'Add to Home Screen'
        <XCircleIcon
          onClick={stopEventPropagation}
          className=" text-brand-700 h-4 w-4 cursor-pointer"
        />
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;
