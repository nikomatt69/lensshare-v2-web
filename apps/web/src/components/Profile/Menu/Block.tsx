import { Menu } from '@headlessui/react';
import { NoSymbolIcon } from '@heroicons/react/24/outline';
import type { Profile } from '@lensshare/lens';
import getProfile from '@lensshare/lib/getProfile';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import cn from '@lensshare/ui/cn';
import type { FC } from 'react';
import { useGlobalAlertStateStore } from 'src/store/useGlobalAlertStateStore';

interface BlockProps {
  profile: Profile;
}

const Block: FC<BlockProps> = ({ profile }) => {
  const { setShowBlockOrUnblockAlert } = useGlobalAlertStateStore();
  const isBlockedByMe = profile.operations.isBlockedByMe.value;

  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        cn(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm'
        )
      }
      onClick={async (event) => {
        stopEventPropagation(event);
        setShowBlockOrUnblockAlert(true, profile);
      }}
    >
      <div className="flex items-center space-x-2">
        <NoSymbolIcon className="h-4 w-4" />
        <div>
          {isBlockedByMe ? 'Unblock' : 'Block'}{' '}
          {getProfile(profile).slugWithPrefix}
        </div>
      </div>
    </Menu.Item>
  );
};

export default Block;
