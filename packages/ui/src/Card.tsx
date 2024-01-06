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
        '[#d9dff1f6] rounded-xl border dark:border-gray-900 ',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};
