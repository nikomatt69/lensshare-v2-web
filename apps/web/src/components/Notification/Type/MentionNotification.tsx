import Markup from '@components/Shared/Markup';
import { AtSymbolIcon } from '@heroicons/react/24/outline';
import { MentionNotification } from '@lensshare/lens';
import getPublicationData from '@lensshare/lib/getPublicationData';
import Link from 'next/link';
import type { FC } from 'react';
import { memo } from 'react';

import AggregatedNotificationTitle from '../AggregatedNotificationTitle';
import { NotificationProfileAvatar } from '../Profile';
import { useEffectOnce } from 'usehooks-ts';
import pushToImpressions from '@lib/pushToImpressions';
// million-ignore
interface MentionNotificationProps {
  notification: MentionNotification;
}
// million-ignore
const MentionNotification: FC<MentionNotificationProps> = ({
  notification
}) => {
  const metadata = notification?.publication.metadata;
  const filteredContent = getPublicationData(metadata)?.content || '';
  const firstProfile = notification.publication.by;

  const text = 'mentioned you in a';
  const type = notification.publication.__typename;


  useEffectOnce(() => {
    pushToImpressions(notification.publication.id);
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <AtSymbolIcon className="text-brand-500/70 h-6 w-6" />
        <div className="flex items-center space-x-1">
          <NotificationProfileAvatar profile={firstProfile} />
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
          <Markup mentions={notification?.publication.profilesMentioned}>
            {filteredContent}
          </Markup>
        </Link>
      </div>
    </div>
  );
};

export default memo(MentionNotification);
