import { BookmarkIcon } from '@heroicons/react/24/outline';
import cn from '@lensshare/ui/cn';
import Link from 'next/link';
import type { FC } from 'react';

interface BookmarksProps {
  onClick?: () => void;
  className?: string;
}

const Bookmarks: FC<BookmarksProps> = ({ onClick, className = '' }) => {
  return (
    <Link
      href="/bookmarks"
      className={cn(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={onClick}
    >
      <BookmarkIcon className="h-4 w-4" />
      <div>Bookmarks</div>
    </Link>
  );
};

export default Bookmarks;
