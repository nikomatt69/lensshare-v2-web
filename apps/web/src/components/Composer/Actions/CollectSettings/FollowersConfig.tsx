import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import type { FC } from 'react';
import { useCollectModuleStore } from 'src/store/non-persisted/useCollectModuleStore';


interface FollowersConfigProps {
  setCollectType: (data: any) => void;
}

const FollowersConfig: FC<FollowersConfigProps> = ({ setCollectType }) => {
  const { collectModule } = useCollectModuleStore((state) => state);

  return (
    <div className="mt-5">
      <ToggleWithHelper
        description="Only followers can collect"
        heading="Exclusivity"
        icon={<UserGroupIcon className="h-5 w-5" />}
        on={collectModule.followerOnly || false}
        setOn={() =>
          setCollectType({ followerOnly: !collectModule.followerOnly })
        }
      />
    </div>
  );
};

export default FollowersConfig;