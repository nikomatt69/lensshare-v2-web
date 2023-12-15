import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { Card } from '@lensshare/ui';
import isVerified from '@lib/isVerified';
import type { FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';

const Verification: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <Card className="space-y-2 p-5">
      <div className="text-lg font-bold">Verified</div>
      {isVerified(currentProfile?.id) ? (
        <div className="flex items-center space-x-1.5">
          <span>Believe it. Yes, you're really verified.</span>
          <CheckBadgeIcon className="text-brand h-5 w-5" />
        </div>
      ) : (
        <div>No.</div>
      )}
    </Card>
  );
};

export default Verification;
