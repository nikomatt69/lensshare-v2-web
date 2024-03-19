import { EyeSlashIcon } from '@heroicons/react/24/outline';
import { APP_NAME } from '@lensshare/data/constants';
import { Card } from '@lensshare/ui';
import type { FC } from 'react';

interface NotSupportedPublicationProps {
  type?: string;
}

const NotSupportedPublication: FC<NotSupportedPublicationProps> = ({
  type = 'Publication'
}) => {
  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800">
      <div className="flex items-center space-x-1 px-4 py-3 text-sm">
        <EyeSlashIcon className="h-4 w-4 text-gray-500" />
        <span>
          {type.replace('MetadataV3', 'MetadataV2')} type not supported on {APP_NAME}
        </span>
      </div>
    </Card>
  );
};

export default NotSupportedPublication;
