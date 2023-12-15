import Profiles from '@components/Shared/Profiles';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import type { Mirror } from '@lensshare/lens';
import type { FC } from 'react';

interface MirroredProps {
  publication: Mirror;
}

const Mirrored: FC<MirroredProps> = ({ publication }) => {
  return (
    <div className="lt-text-gray-500 flex items-center space-x-1 pb-4 text-[13px]">
      <ArrowsRightLeftIcon className="h-4 w-4" />
      <Profiles profiles={[publication.by]} context="mirrored" />
    </div>
  );
};

export default Mirrored;
