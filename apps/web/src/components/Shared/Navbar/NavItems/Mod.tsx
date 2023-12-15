import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import cn from '@lensshare/ui/cn';
import type { FC } from 'react';

interface ModProps {
  className?: string;
}

const Mod: FC<ModProps> = ({ className = '' }) => {
  return (
    <div
      className={cn(
        'flex w-full items-center space-x-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      <div>
        <ShieldCheckIcon className="h-4 w-4" />
      </div>
      <div>Moderation</div>
    </div>
  );
};

export default Mod;
