import Markup from '@components/Shared/Markup';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import type { QuoteNotification } from '@lensshare/lens';
import getPublicationData from '@lensshare/lib/getPublicationData';
import Link from 'next/link';
import type { FC } from 'react';
import { memo } from 'react';

import AggregatedNotificationTitle from '../AggregatedNotificationTitle';
import { NotificationProfileAvatar } from '../Profile';
import { useEffectOnce } from 'usehooks-ts';
import pushToImpressions from '@lib/pushToImpressions';
import usePushToImpressions from 'src/hooks/usePushToImpressions';
// million-ignore
interface QuoteNotificationProps {
  notification: QuoteNotification;
}
// million-ignore
const QuoteNotification: FC<QuoteNotificationProps> = ({ notification }) => {
  const metadata = notification?.quote.metadata;
  const filteredContent = getPublicationData(metadata)?.content || '';
  const firstProfile = notification.quote.by;

  const text = 'quoted your';
  const type = notification.quote.quoteOn.__typename;

  usePushToImpressions(notification.quote.id);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <ChatBubbleBottomCenterTextIcon className="text-brand-500/70 h-6 w-6" />
        <div className="flex items-center space-x-1">
          <NotificationProfileAvatar profile={firstProfile} />
        </div>
      </div>
      <div className="ml-9">
        <AggregatedNotificationTitle
          firstProfile={firstProfile}
          text={text}
          type={type}
          linkToType={`/posts/${notification?.quote?.id}`}
        />
        <Link
          href={`/posts/${notification?.quote?.id}`}
          className="lt-text-gray-500 linkify mt-2 line-clamp-2"
        >
          <Markup mentions={notification.quote.profilesMentioned}>
            {filteredContent}
          </Markup>
        </Link>
      </div>
    </div>
  );
};

export default memo(QuoteNotification);
