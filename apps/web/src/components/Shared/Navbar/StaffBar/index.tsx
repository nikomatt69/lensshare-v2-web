import { GlobeAltIcon, HashtagIcon } from '@heroicons/react/24/outline';
import {
  GIT_COMMIT_SHA,
  IS_MAINNET,

} from '@lensshare/data/constants';
import cn from '@lensshare/ui/cn';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';
import urlcat from 'urlcat';

import Performance from './Performance';

interface BadgeProps {
  children: ReactNode;
}

export const Badge: FC<BadgeProps> = ({ children }) => (
  <span className="rounded-md bg-gray-300 px-1.5 py-0.5 text-xs font-bold dark:bg-gray-600">
    {children}
  </span>
);

const StaffBar: FC = () => {
  return (
    <div className="bg-gray-200 px-3 py-1 text-sm dark:bg-gray-800">
      <div className="mr-5 flex flex-wrap items-center gap-2">
        <Performance />
        <div className="flex items-center space-x-1">
          <GlobeAltIcon
            className={cn(
              IS_MAINNET ? 'text-green-500' : 'text-yellow-500',
              'h-4 w-4'
            )}
          />
          <Badge>
            {IS_MAINNET ? 'prod' : 'prod'}{' '}
            <span className="text-[10px]">
              ({IS_MAINNET ? 'mainnet' : 'mainnet'})
            </span>
          </Badge>
        </div>
        {GIT_COMMIT_SHA ? (
          <Link
            href={urlcat('https://github.com/heyxyz/hey/commit/:sha', {
              sha: GIT_COMMIT_SHA
            })}
            className="flex items-center space-x-1"
            title="Git commit SHA"
            target="_blank"
            rel="noreferrer noopener"
          >
            <HashtagIcon className="h-4 w-4" />
            <Badge>{GIT_COMMIT_SHA}</Badge>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default StaffBar;
