import { TicketIcon } from '@heroicons/react/24/outline';
import { INVITE } from '@lensshare/data/tracking';
import cn from '@lensshare/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/useGlobalModalStateStore';

interface InvitesProps {
  className?: string;
}

const Invites: FC<InvitesProps> = ({ className = '' }) => {
  const setShowInvitesModal = useGlobalModalStateStore(
    (state) => state.setShowInvitesModal
  );

  return (
    <button
      className={cn(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-left text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={() => {
        setShowInvitesModal(true);

      }}
    >
      <div>
        <TicketIcon className="h-4 w-4" />
      </div>
      <div>Invites</div>
    </button>
  );
};

export default Invites;
