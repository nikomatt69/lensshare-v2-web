import type { AnyPublication } from '@lensshare/lens';
import getAppName from '@lensshare/lib/getAppName';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import { formatDate } from '@lib/formatTime';
import { useState, type FC } from 'react';

import PublicationActions from './Actions';
import FeaturedGroup from './FeaturedGroup';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';
import PublicationStats from './PublicationStats';
import PublicationType from './Type';
import { useEffectOnce } from 'usehooks-ts';
import pushToImpressions from '@lib/pushToImpressions';

interface FullPublicationProps {
  publication: AnyPublication;
}

const FullPublication: FC<FullPublicationProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const { metadata, createdAt } = targetPublication;
  useEffectOnce(() => {
    pushToImpressions(targetPublication.id);
  });

  const [views, setViews] = useState<number | null>(null);

  return (
    <article className="p-4">
      <PublicationType publication={targetPublication} showType />
      <div>
        <PublicationHeader publication={targetPublication} />
        <div className="ml-[53px]">
          {targetPublication.isHidden ? (
            <HiddenPublication type={targetPublication.__typename} />
          ) : (
            <>
              <PublicationBody publication={targetPublication} />
              <div className="flex items-center gap-x-3">
                <div className="lt-text-gray-500 my-2 text-sm">
                  <span>
                    {formatDate(new Date(createdAt), 'hh:mm A · MMM D, YYYY')}
                  </span>
                 {metadata.appId ? (
                    <span> · Posted via {getAppName(metadata.appId)}</span>
                  ) : null}
                </div>
                <FeaturedGroup tags={metadata.tags} />
              </div>
              <PublicationStats publication={targetPublication} />
              <div className="divider" />
              <PublicationActions publication={targetPublication} showCount />
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default FullPublication;
