import { Menu } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/24/outline';
import type { AnyPublication } from '@lensshare/lens';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import cn from '@lensshare/ui/cn';
import type { FC } from 'react';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

interface DeleteProps {
  publication: AnyPublication;
}

const Delete: FC<DeleteProps> = ({ publication }) => {
  const {setShowPublicationDeleteAlert} = useGlobalAlertStateStore(
    
  );

  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        cn(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm text-red-500'
        )
      }
      onClick={(event: any) => {
        stopEventPropagation(event);
        setShowPublicationDeleteAlert(true, publication);
      }}
    >
      <div className="flex items-center space-x-2">
        <TrashIcon className="h-4 w-4" />
        <div>Delete</div>
      </div>
    </Menu.Item>
  );
};

export default Delete;
