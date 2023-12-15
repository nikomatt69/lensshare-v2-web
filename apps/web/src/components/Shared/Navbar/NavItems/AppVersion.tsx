import { APP_VERSION } from '@lensshare/data/constants';
import Link from 'next/link';
import type { FC } from 'react';
import urlcat from 'urlcat';

interface AppVersionProps {
  onClick?: () => void;
}

const AppVersion: FC<AppVersionProps> = ({ onClick }) => {
  return (
    <div className="px-6 py-3 text-xs">
      <Link
        href={urlcat('https://github.com/nikomatt69/LensShare-2.0/releases/tag/:version', {
          version: `v${APP_VERSION}`
        })}
        className="font-mono"
        target="_blank"
        rel="noreferrer noopener"
        onClick={onClick}
      >
        v{APP_VERSION}
      </Link>
    </div>
  );
};

export default AppVersion;
