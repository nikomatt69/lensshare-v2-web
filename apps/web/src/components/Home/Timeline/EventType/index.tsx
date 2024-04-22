import type { FeedItem } from '@lensshare/lens';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import type { FC } from 'react';

import Acted from './Acted';
import Combined from './Combined';
import Commented from './Commented';
import Liked from './Liked';
import Mirrored from './Mirrored';

const getCanCombined = (aggregations: number[]) => {
  // show combined reactions if more than 2 items in aggregations
  return aggregations.filter((n) => n > 0).length > 1;
};

interface ActionTypeProps {
  feedItem: FeedItem;
}

const ActionType: FC<ActionTypeProps> = ({ feedItem }) => {
  const { root, mirrors, reactions, acted, comments } = feedItem;
  const isComment = root.__typename === 'Comment';
  const showThread = isComment || (comments?.length ?? 0) > 0;

  const canCombined = getCanCombined([
    mirrors?.length ?? 0,
    reactions?.length ?? 0,
    acted?.length ?? 0,
    comments?.length ?? 0
  ]);

  return (
    <span onClick={stopEventPropagation} aria-hidden="true">
      {canCombined ? (
        <Combined feedItem={feedItem} />
      ) : (
        <>
          {mirrors?.length && !isComment ? (
            <Mirrored mirrors={mirrors} />
          ) : null}
          {acted?.length && !isComment ? <Acted acted={acted} /> : null}
          {reactions?.length && !isComment ? (
            <Liked reactions={reactions} />
          ) : null}
        </>
      )}
      {showThread ? <Commented feedItem={feedItem} /> : null}
    </span>
  );
};

export default ActionType;
