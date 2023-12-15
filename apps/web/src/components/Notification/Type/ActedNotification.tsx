import Markup from '@components/Shared/Markup';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { ActedNotification } from '@lensshare/lens';
import getPublicationData from '@lensshare/lib/getPublicationData';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import Link from 'next/link';
import plur from 'plur';
import type { FC } from 'react';
import { memo } from 'react';

import AggregatedNotificationTitle from '../AggregatedNotificationTitle';
import { NotificationProfileAvatar } from '../Profile';
import { useEffectOnce } from 'usehooks-ts';
import pushToImpressions from '@lib/pushToImpressions';
// million-ignore
interface ActedNotificationProps {
  notification: ActedNotification;
}
// million-ignore
const ActedNotification: FC<ActedNotificationProps> = ({ notification }) => {
  const publication = notification?.publication;
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { metadata } = targetPublication;
  const filteredContent = getPublicationData(metadata)?.content || '';
  const actions = notification?.actions;
  const firstProfile = actions?.[0]?.by;
  const length = actions.length - 1;
  const moreThanOneProfile = length > 1;

  useEffectOnce(() => {
    pushToImpressions(notification.publication.id);
  });

  const text = moreThanOneProfile
    ? `and ${length} ${plur('other', length)} acted on your`
    : 'acted on your';
  const type = notification?.publication.__typename;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <RectangleStackIcon className="text-brand-500/70 h-6 w-6" />
        <div className="flex items-center space-x-1">
          {actions.slice(0, 10).map((action) => (
            <div key={action.by.id}>
              <NotificationProfileAvatar profile={action.by} />
            </div>
          ))}
        </div>
      </div>
      <div className="ml-9">
        <AggregatedNotificationTitle
          firstProfile={firstProfile}
          text={text}
          type={type}
          linkToType={`/posts/${notification?.publication?.id}`}
        />
        <Link
          href={`/posts/${notification?.publication?.id}`}
          className="lt-text-gray-500 linkify mt-2 line-clamp-2"
        >
          <Markup mentions={targetPublication.profilesMentioned}>
            {filteredContent}
          </Markup>
        </Link>
      </div>
    </div>
  );
};

export default memo(ActedNotification);
