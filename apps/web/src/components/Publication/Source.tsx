import { apps } from '@lensshare/data/apps';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import type { AnyPublication } from '@lensshare/lens';
import getAppName from '@lensshare/lib/getAppName';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import { Tooltip } from '@lensshare/ui';
import type { FC } from 'react';

interface SourceProps {
  publishedOn: string;
}

const Source: FC<SourceProps> = ({ publishedOn }) => {
  const show = apps.includes(publishedOn);

  if (!show) {
    return null;
  }

  const appName = getAppName(publishedOn);

  return (
    <Tooltip content={appName} placement="top">
      <img
        alt={appName}
        className="w-4"
        src={`${STATIC_ASSETS_URL}/source/${publishedOn}.jpeg`}
      />
    </Tooltip>
  );
};

export default Source;

