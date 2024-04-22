import { Menu } from '@headlessui/react';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@lensshare/data/tracking';
import type { AnyPublication } from '@lensshare/lens';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import cn from '@lensshare/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import toast from 'react-hot-toast';

interface ShareProps {
  publication: AnyPublication;
}

const Share: FC<ShareProps> = ({ publication }) => {
  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        cn(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm'
        )
      }
      onClick={async (event: any) => {
        stopEventPropagation(event);
        await navigator.clipboard.writeText(
          `${location.origin}/posts/${publication?.id}`
        );
        toast.success('Copied to clipboard!');
   
      }}
    >
      <div className="flex items-center space-x-2">
        <ClipboardDocumentIcon className="h-4 w-4" />
        <div>Share</div>
      </div>
    </Menu.Item>
  );
};

export default Share;
