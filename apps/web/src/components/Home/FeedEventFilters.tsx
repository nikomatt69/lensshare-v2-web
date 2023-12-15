import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';
import { Checkbox, Tooltip } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import type { ChangeEvent, FC } from 'react';
import { useTimelinePersistStore } from 'src/store/useTimelinePersistStore';

const FeedEventFilters: FC = () => {
  const feedEventFilters = useTimelinePersistStore(
    (state) => state.feedEventFilters
  );
  const setFeedEventFilters = useTimelinePersistStore(
    (state) => state.setFeedEventFilters
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFeedEventFilters({
      ...feedEventFilters,
      [e.target.name]: e.target.checked
    });
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="rounded-md p-1 hover:bg-gray-300/20">
        <Tooltip placement="top" content="Filter">
          <AdjustmentsVerticalIcon className="text-brand h-5 w-5" />
        </Tooltip>
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          static
          className="absolute right-0 z-[5] mt-1 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          <Menu.Item
            as="label"
            className={({ active }) =>
              cn(
                { 'dropdown-active': active },
                'menu-item flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
              )
            }
          >
            <Checkbox
              onChange={handleChange}
              checked={feedEventFilters.posts}
              name="posts"
              label="Show Posts"
            />
          </Menu.Item>
          <Menu.Item
            as="label"
            className={({ active }) =>
              cn(
                { 'dropdown-active': active },
                'menu-item flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
              )
            }
          >
            <Checkbox
              onChange={handleChange}
              checked={feedEventFilters.mirrors}
              name="mirrors"
              label="Show Mirrors"
            />
          </Menu.Item>
          <Menu.Item
            as="label"
            className={({ active }) =>
              cn(
                { 'dropdown-active': active },
                'menu-item flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
              )
            }
          >
            <Checkbox
              onChange={handleChange}
              checked={feedEventFilters.likes}
              name="likes"
              label="Show Likes"
            />
          </Menu.Item>
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default FeedEventFilters;
