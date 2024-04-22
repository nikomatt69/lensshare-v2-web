import { Menu } from '@headlessui/react';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@lensshare/data/tracking';
import type { AnyPublication } from '@lensshare/lens';
import getPublicationData from '@lensshare/lib/getPublicationData';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import cn from '@lensshare/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import toast from 'react-hot-toast';

interface CopyPostTextProps {
  publication: AnyPublication;
}

const CopyPostText: FC<CopyPostTextProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const publicationType = targetPublication.__typename;
  const filteredContent =
    getPublicationData(targetPublication.metadata)?.content || '';

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
        await navigator.clipboard.writeText(filteredContent || '');
        toast.success('Copied to clipboard!');
      
      }}
    >
      <div className="flex items-center space-x-2">
        <ClipboardDocumentIcon className="h-4 w-4" />
        <div>
          {publicationType === 'Comment'
            ? 'Copy comment text'
            : 'Copy post text'}
        </div>
      </div>
    </Menu.Item>
  );
};

export default CopyPostText;
