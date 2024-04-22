import Collectors from '@components/Shared/Modal/Collectors';
import Likes from '@components/Shared/Modal/Likes';
import Mirrors from '@components/Shared/Modal/Mirrors';
import Quotes from '@components/Shared/Modal/Quotes';
import {
  ArrowsRightLeftIcon,
  HeartIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';
import type { AnyPublication } from '@lensshare/lens';
import getPublicationsViews from '@lensshare/lib/getPublicationsViews';
import nFormatter from '@lensshare/lib/nFormatter';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import { Modal } from '@lensshare/ui';
import plur from 'plur';
import type { FC } from 'react';
import { memo, useEffect, useState } from 'react';
import { useBookmarkOptimisticStore } from 'src/store/OptimisticActions/useBookmarkOptimisticStore';
import { useMirrorOrQuoteOptimisticStore } from 'src/store/OptimisticActions/useMirrorOrQuoteOptimisticStore';
import { useOpenActionOptimisticStore } from 'src/store/OptimisticActions/useOpenActionOptimisticStore';
import { useReactionOptimisticStore } from 'src/store/OptimisticActions/useReactionOptimisticStore';

interface PublicationStatsProps {
  publication: AnyPublication;
}

const PublicationStats: FC<PublicationStatsProps> = ({ publication }) => {
  const { getReactionCountByPublicationId, setReactionConfig } =
    useReactionOptimisticStore();
  const { getMirrorOrQuoteCountByPublicationId, setMirrorOrQuoteConfig } =
    useMirrorOrQuoteOptimisticStore();
  const { getOpenActionCountByPublicationId, setOpenActionPublicationConfig } =
    useOpenActionOptimisticStore();
  const { getBookmarkCountByPublicationId, setBookmarkConfig } =
    useBookmarkOptimisticStore();

  const [showMirrorsModal, setShowMirrorsModal] = useState(false);
  const [showQuotesModal, setShowQuotesModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);
  const [views, setViews] = useState<number>(0);

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  useEffect(() => {
    setReactionConfig(targetPublication.id, {
      countReaction: targetPublication.stats.reactions,
      reacted: targetPublication.operations.hasReacted
    });
    setMirrorOrQuoteConfig(targetPublication.id, {
      // We done substracting quotes because quotes are counted separately
      countMirrorOrQuote:
        targetPublication.stats.mirrors - targetPublication.stats.quotes,
      mirroredOrQuoted:
        targetPublication.operations.hasMirrored ||
        targetPublication.operations.hasQuoted
    });
    setOpenActionPublicationConfig(targetPublication.id, {
      countOpenActions: targetPublication.stats.countOpenActions,
      acted: targetPublication.operations.hasActed.value
    });
    setBookmarkConfig(targetPublication.id, {
      countBookmarks: targetPublication.stats.bookmarks,
      bookmarked: targetPublication.operations.hasBookmarked
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPublication]);

  const reactionsCount = getReactionCountByPublicationId(targetPublication.id);
  const mirrorOrQuoteCount = getMirrorOrQuoteCountByPublicationId(
    targetPublication.id
  );
  const openActionsCount = getOpenActionCountByPublicationId(
    targetPublication.id
  );
  const bookmarksCount = getBookmarkCountByPublicationId(targetPublication.id);
  const quotesCount = targetPublication.stats.quotes;
  const commentsCount = targetPublication.stats.comments;
  const publicationId = targetPublication.id;
  useEffect(() => {
    // Get Views
    getPublicationsViews([targetPublication.id]).then((viewsResponse) => {
      setViews(viewsResponse?.[0]?.views);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPublication]);

  const showStats =
    mirrorOrQuoteCount > 0 ||
    quotesCount > 0 ||
    commentsCount > 0 ||
    reactionsCount > 0 ||
    openActionsCount > 0 ||
    bookmarksCount > 0 ||
    views > 0;

  if (!showStats) {
    return null;
  }

  return (
    <>
      <div className="divider" />
      <div className="lt-text-gray-500 flex flex-wrap items-center gap-6 py-3 text-sm sm:gap-8">
        {commentsCount > 0 ? (
          <span>
            <b className="text-black dark:text-white">
              {nFormatter(commentsCount)}
            </b>{' '}
            {plur('Comment', commentsCount)}
          </span>
        ) : null}
        {mirrorOrQuoteCount > 0 ? (
          <>
            <button
              type="button"
              onClick={() => {
                setShowMirrorsModal(true);
              }}
            >
              <b className="text-black dark:text-white">
                {nFormatter(mirrorOrQuoteCount)}
              </b>{' '}
              {plur('Mirror', commentsCount)}
            </button>
            <Modal
              title="Mirrored by"
              icon={<ArrowsRightLeftIcon className="text-brand h-5 w-5" />}
              show={showMirrorsModal}
              onClose={() => setShowMirrorsModal(false)}
            >
              <Mirrors publicationId={publicationId} />
            </Modal>
          </>
        ) : null}
        {quotesCount > 0 ? (
          <>
            <button
              type="button"
              onClick={() => {
                setShowQuotesModal(true);
              }}
            >
              <b className="text-black dark:text-white">
                {nFormatter(quotesCount)}
              </b>{' '}
              {plur('Quote', quotesCount)}
            </button>
            <Modal
              title="Quoted by"
              icon={<ArrowsRightLeftIcon className="text-brand h-5 w-5" />}
              show={showQuotesModal}
              onClose={() => setShowQuotesModal(false)}
            >
              <Quotes publicationId={publicationId} />
            </Modal>
          </>
        ) : null}
        {reactionsCount > 0 ? (
          <>
            <button
              type="button"
              onClick={() => {
                setShowLikesModal(true);
              }}
            >
              <b className="text-black dark:text-white">
                {nFormatter(reactionsCount)}
              </b>{' '}
              {plur('Like', reactionsCount)}
            </button>
            <Modal
              title="Liked by"
              icon={<HeartIcon className="text-brand h-5 w-5" />}
              show={showLikesModal}
              onClose={() => setShowLikesModal(false)}
            >
              <Likes publicationId={publicationId} />
            </Modal>
          </>
        ) : null}
        {openActionsCount > 0 ? (
          <>
            <button
              type="button"
              onClick={() => {
                setShowCollectorsModal(true);
              }}
            >
              <b className="text-black dark:text-white">
                {nFormatter(openActionsCount)}
              </b>{' '}
              {plur('Collect', openActionsCount)}
            </button>
            <Modal
              title="Collected by"
              icon={<RectangleStackIcon className="text-brand h-5 w-5" />}
              show={showCollectorsModal}
              onClose={() => setShowCollectorsModal(false)}
            >
              <Collectors publicationId={publicationId} />
            </Modal>
          </>
        ) : null}
        {bookmarksCount > 0 ? (
          <span>
            <b className="text-black dark:text-white">
              {nFormatter(bookmarksCount)}
            </b>{' '}
            {plur('Bookmark', bookmarksCount)}
          </span>
        ) : null}
        {views > 0 ? (
          <span>
            <b className="text-black dark:text-white">{nFormatter(views)}</b>{' '}
            {plur('View', views)}
          </span>
        ) : null}
      </div>
    </>
  );
};

export default memo(PublicationStats);
