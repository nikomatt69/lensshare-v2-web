import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import { Card } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import type { FC, ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
  className?: string;
  zeroPadding?: boolean;
}

const Wrapper: FC<WrapperProps> = ({
  children,
  className = '',
  zeroPadding = false
}) => (
  <Card
    className={cn('mt-3 cursor-auto', className, { 'p-5': !zeroPadding })}
    forceRounded
    onClick={stopEventPropagation}
  >
    {children}
  </Card>
);

export default Wrapper;
