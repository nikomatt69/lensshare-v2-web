import { UserIcon } from '@heroicons/react/24/outline';
import cn from '@lensshare/ui/cn';
import type { FC } from 'react';

interface YourProfileProps {
  className?: string;
}

const YourProfile: FC<YourProfileProps> = ({ className = '' }) => {
  return (
    <div
      className={cn(
        'flex w-full items-center space-x-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      <div>
        <UserIcon className="h-4 w-4" />
      </div>
      <div>Your profile</div>
    </div>
  );
};

export default YourProfile;
