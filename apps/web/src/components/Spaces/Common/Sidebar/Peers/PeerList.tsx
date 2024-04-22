// Utils
// Assets


import cn from '@lensshare/ui/cn';
import type { FC, ReactNode } from 'react';
import React from 'react';

interface PeerListProps {
  count?: number | string;
  className?: string;
  title: string;
  children: ReactNode;
}

const PeerList: FC<PeerListProps> = ({ className, children, title, count }) => {
  const TitleArr = ['Speakers', 'Listeners', 'Requested to Speak'];

  return (
    <div className={cn(className)}>
      <div className="flex h-full items-center gap-4 overflow-y-auto">
        <div className="h-[1px] flex-1 translate-y-2 bg-gray-400 dark:bg-gray-800" />
        <div className="relative mt-4 flex items-center justify-center gap-1 text-xs font-medium text-gray-400 dark:text-gray-300">
          <span>{title}</span>
          {TitleArr.includes(title) && <span>- {count}</span>}
        </div>
        <div className="h-[1px] flex-1 translate-y-2 bg-gray-400 dark:bg-gray-800" />
      </div>
      {children}
    </div>
  );
};
export default React.memo(PeerList);
