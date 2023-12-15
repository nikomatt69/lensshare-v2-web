import { DocumentMinusIcon } from '@heroicons/react/24/outline';
import { Modal } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { useTheme } from 'next-themes';
import type { FC } from 'react';
import { useState } from 'react';

import { BasicIcons } from './BasicIcons';
import DropDownMenu from './DropDownMenu';

const SwitchDeviceMenu: FC = () => {
  const { resolvedTheme } = useTheme();

  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowSettings(!showSettings)}
        className={cn('flex h-10 w-10 items-center justify-center rounded-xl')}
      >
        <DocumentMinusIcon className="text-brand-500 flex h-6 w-6 items-center justify-center rounded-xl" />
      </button>
      <Modal show={showSettings} onClose={() => setShowSettings(false)}>
        <div
          className={cn(
            resolvedTheme == 'dark' ? 'bg-gray-900' : 'bg-brand-100',
            'rounded-xl p-5'
          )}
        >
          <div className="flex items-center gap-2 self-stretch text-slate-500">
            {BasicIcons.active['cam']}
            <div className="flex h-[2.75rem] items-center justify-between self-stretch">
              <DropDownMenu deviceType={'video'} />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 self-stretch text-slate-500">
            {BasicIcons.active['mic']}
            <div className="flex h-[2.75rem] items-center justify-between self-stretch">
              <DropDownMenu deviceType={'audioInput'} />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 self-stretch text-slate-500">
            {BasicIcons.speaker}
            <div className="flex h-[2.75rem] items-center justify-between self-stretch">
              <DropDownMenu deviceType={'audioOutput'} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SwitchDeviceMenu;
