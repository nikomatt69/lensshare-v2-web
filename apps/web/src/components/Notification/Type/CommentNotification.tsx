//million-ignore
import Markup from '@components/Shared/Markup';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import type { CommentNotification } from '@lensshare/lens';
import getPublicationData from '@lensshare/lib/getPublicationData';
import Link from 'next/link';
import type { FC } from 'react';
import { memo } from 'react';

import AggregatedNotificationTitle from '../AggregatedNotificationTitle';
import { NotificationProfileAvatar } from '../Profile';
import { useEffectOnce } from 'usehooks-ts';
import pushToImpressions from '@lib/pushToImpressions';
// million-ignore
interface CommentNotificationProps {
  notification: CommentNotification;
}

// million-ignore
const CommentNotification: FC<CommentNotificationProps> = ({
  notification
}) => {
  const metadata = notification?.comment.metadata;
  const filteredContent = getPublicationData(metadata)?.content || '';
  const firstProfile = notification.comment.by;

  const text = 'commented on your';
  // TODO: remove ? when we have commentOn field in the comment
  const type = notification.comment.commentOn?.__typename;



  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <ChatBubbleOvalLeftEllipsisIcon className="text-brand-500/70 h-6 w-6" />
        <div className="flex items-center space-x-1">
          <NotificationProfileAvatar profile={firstProfile} />
        </div>
      </div>
      <div className="ml-9">
        <AggregatedNotificationTitle
          firstProfile={firstProfile}
          text={text}
          type={type}
          linkToType={`/posts/${notification?.comment?.id}`}
        />
        <Link
          href={`/posts/${notification?.comment?.id}`}
          className="lt-text-gray-500 linkify mt-2 line-clamp-2"
        >
          <Markup mentions={notification.comment.profilesMentioned}>
            {filteredContent}
          </Markup>
        </Link>
      </div>
    </div>
  );
};

export default memo(CommentNotification);
