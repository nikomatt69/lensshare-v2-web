import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { ClockIcon } from '@heroicons/react/24/outline';
import type { CollectModuleType } from '@lensshare/types/hey';
import { Input } from '@lensshare/ui';
import { getNumberOfDaysFromDate, getTimeAddedNDay } from '@lib/formatTime';
import type { FC } from 'react';
import { useCollectModuleStore } from 'src/store/useCollectModuleStore';

interface TimeLimitConfigProps {
  setCollectType: (data: CollectModuleType) => void;
}

const TimeLimitConfig: FC<TimeLimitConfigProps> = ({ setCollectType }) => {
  const { collectModule } = useCollectModuleStore((state) => state);

  return (
    <div className="mt-5">
      <ToggleWithHelper
        description="Limit collecting to specific period of time"
        heading="Time limit"
        icon={<ClockIcon className="h-5 w-5" />}
        on={Boolean(collectModule.endsAt)}
        setOn={() =>
          setCollectType({
            endsAt: collectModule.endsAt ? null : getTimeAddedNDay(1)
          })
        }
      />
      {collectModule.endsAt ? (
        <div className="ml-8 mt-4 text-sm">
          <Input
            label="Number of days"
            max="100"
            min="1"
            onChange={(event) => {
              setCollectType({
                endsAt: getTimeAddedNDay(Number(event.target.value))
              });
            }}
            placeholder="5"
            type="number"
            value={getNumberOfDaysFromDate(new Date(collectModule.endsAt))}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TimeLimitConfig;