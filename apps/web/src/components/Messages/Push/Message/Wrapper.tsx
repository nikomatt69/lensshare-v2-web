import type { ReactNode } from 'react';

import clsx from 'clsx';
import React from 'react';

import { MessageOrigin } from './Card';

interface MessageWrapperProps {
  children: ReactNode;
  isAttachment: boolean;
  messageOrigin: MessageOrigin;
}

export const MessageWrapper: React.FC<MessageWrapperProps> = ({
  children,
  isAttachment,
  messageOrigin
}) => {
  return (
    <div
      className={clsx('relative w-fit max-w-fit font-medium', {
        'border py-3 pl-4 pr-[50px]': !isAttachment,
        'rounded-xl rounded-tl-sm': messageOrigin === MessageOrigin.Receiver,
        'bg-brand-500 rounded-xl rounded-tr-sm':
          messageOrigin === MessageOrigin.Sender
      })}
    >
      {children}
    </div>
  );
};
