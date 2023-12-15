import type { PublicationMetadata } from '@lensshare/lens';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import cn from '@lensshare/ui/cn';
import getGroupByTag from '@lib/getGroupByTag';
import Link from 'next/link';
import type { FC } from 'react';

interface FeaturedGroupProps {
  tags: PublicationMetadata['tags'];
  className?: string;
}

const FeaturedGroup: FC<FeaturedGroupProps> = ({ tags, className = '' }) => {
  const group = getGroupByTag(tags || []);

  if (!group) {
    return null;
  }

  return (
    <Link
      href={`/g/${group.slug}`}
      className={cn(
        'flex items-center space-x-2 text-xs hover:underline',
        className
      )}
      onClick={(e) => stopEventPropagation(e)}
    >
      <img src={group.avatar} className="h-4 w-4 rounded" />
      <div className="font-bold">{group.name}</div>
    </Link>
  );
};

export default FeaturedGroup;
