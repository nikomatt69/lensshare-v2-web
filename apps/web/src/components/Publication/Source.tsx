import { apps } from '@lensshare/data/apps';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import type { AnyPublication } from '@lensshare/lens';
import getAppName from '@lensshare/lib/getAppName';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import { Tooltip } from '@lensshare/ui';
import type { FC } from 'react';

interface SourceProps {
  publication: AnyPublication;
}

const Source: FC<SourceProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { appId } = targetPublication.metadata;
  const show = apps.includes(appId);

  if (!show) {
    return null;
  }

  const appName = getAppName(appId);

  return (
    <Tooltip content={appName} placement="top">
      <img
        className="h-4 w-4 rounded-full"
        src={`${STATIC_ASSETS_URL}/images/source/${appId}.jpg`}
        alt={appName}
      />
    </Tooltip>
  );
};

export default Source;
