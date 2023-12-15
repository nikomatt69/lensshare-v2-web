import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { SYSTEM } from '@lensshare/data/tracking';
import cn from '@lensshare/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { useTheme } from 'next-themes';
import type { FC } from 'react';

interface ThemeSwitchProps {
  onClick?: () => void;
  className?: string;
}

const ThemeSwitch: FC<ThemeSwitchProps> = ({ onClick, className = '' }) => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      className={cn(
        'flex w-full px-2 py-1.5 text-left text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
   
        onClick?.();
      }}
    >
      <div className="flex items-center space-x-1.5">
        {theme === 'light' ? (
          <>
            <div>
              <MoonIcon className="h-4 w-4" />
            </div>
            <div>Dark mode</div>
          </>
        ) : (
          <>
            <div>
              <SunIcon className="h-4 w-4" />
            </div>
            <div>Light mode</div>
          </>
        )}
      </div>
    </button>
  );
};

export default ThemeSwitch;
