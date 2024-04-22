import { StarIcon } from '@heroicons/react/24/solid';
import type { FC } from 'react';

const Beta: FC = () => {
  return (
    <div className="bg-brand-500 border-brand-600 flex items-center space-x-1 rounded-md border px-1.5 text-xs text-white shadow-sm">
      <StarIcon className="h-3 w-3" />
      <div>Beta</div>
    </div>
  );
};

export default Beta;
