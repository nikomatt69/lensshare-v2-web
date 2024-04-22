import type { ElementType, FC, MouseEvent, ReactNode } from 'react';

import cn from '../cn';

interface CardProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  forceRounded?: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export const Card: FC<CardProps> = ({
  children,
  as: Tag = 'div',
  className = '',
  forceRounded = false,
  onClick
}) => {
  return (
    <Tag
      className={cn(
        forceRounded ? 'rounded-xl' : 'rounded-xl sm:rounded-xl',
        'rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-900/90 ',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};
