import type { FC } from 'react';

import { Switch } from '@headlessui/react';

import cn from '../cn';

interface ToggleProps {
  disabled?: boolean;
  on: boolean;
  setOn: (on: boolean) => void;
}

export const Toggle2: FC<ToggleProps> = ({ disabled = false, on, setOn }) => {
  return (
    <Switch
      checked={on}
      className={cn(
        on ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700',
        disabled && 'cursor-not-allowed opacity-50',
        'outline-brand-500 inline-flex h-[22px] w-[42.5px] min-w-[42.5px] rounded-full border-2 border-transparent outline-offset-4 transition-colors duration-200 ease-in-out'
      )}
      disabled={disabled}
      onChange={() => {
        setOn(!on);
      }}
    >
      <span
        className={cn(
          on ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out'
        )}
      />
    </Switch>
  );
};
