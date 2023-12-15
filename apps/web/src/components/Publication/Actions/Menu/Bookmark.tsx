import { Menu } from '@headlessui/react';
import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { PUBLICATION } from '@lensshare/data/tracking';
import {
  type AnyPublication,
  type PublicationBookmarkRequest,
  useAddPublicationBookmarkMutation,
  useRemovePublicationBookmarkMutation
} from '@lensshare/lens';
import type { ApolloCache } from '@lensshare/lens/apollo';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import cn from '@lensshare/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useRouter } from 'next/router';
import { type FC, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useBookmarkOptimisticStore } from 'src/store/OptimisticActions/useBookmarkOptimisticStore';

interface BookmarkProps {
  publication: AnyPublication;
}

const Bookmark: FC<BookmarkProps> = ({ publication }) => {
  const { pathname } = useRouter();
  const {
    getBookmarkCountByPublicationId,
    hasBookmarkedByMe,
    setBookmarkConfig
  } = useBookmarkOptimisticStore();

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const hasBookmarked = hasBookmarkedByMe(targetPublication.id);
  const bookmarksCount = getBookmarkCountByPublicationId(targetPublication.id);

  useEffect(() => {
    setBookmarkConfig(targetPublication.id, {
      countBookmarks: targetPublication.stats.bookmarks,
      bookmarked: targetPublication.operations.hasBookmarked
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publication]);

  const request: PublicationBookmarkRequest = { on: targetPublication.id };

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      id: cache.identify(targetPublication),
      fields: {
        operations: (existingValue) => {
          return { ...existingValue, hasBookmarked: !hasBookmarked };
        }
      }
    });
    cache.modify({
      id: cache.identify(targetPublication.stats),
      fields: {
        bookmarks: () =>
          hasBookmarked ? bookmarksCount - 1 : bookmarksCount + 1
      }
    });

    // Remove bookmarked publication from bookmarks feed
    if (pathname === '/bookmarks') {
      cache.evict({ id: cache.identify(targetPublication) });
    }
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const [addPublicationBookmark] = useAddPublicationBookmarkMutation({
    variables: { request },
    onError: (error) => {
      setBookmarkConfig(targetPublication.id, {
        countBookmarks: bookmarksCount - 1,
        bookmarked: !hasBookmarked
      });
      onError(error);
    },
    onCompleted: () => {
      toast.success('Publication bookmarked!');
     
    },
    update: updateCache
  });

  const [removePublicationBookmark] = useRemovePublicationBookmarkMutation({
    variables: { request },
    onError: (error) => {
      setBookmarkConfig(targetPublication.id, {
        countBookmarks: bookmarksCount + 1,
        bookmarked: !hasBookmarked
      });
      onError(error);
    },
    onCompleted: () => {
      toast.success('Removed publication bookmark!');
   
    },
    update: updateCache
  });

  const togglePublicationProfileBookmark = async () => {
    if (hasBookmarked) {
      setBookmarkConfig(targetPublication.id, {
        countBookmarks: bookmarksCount - 1,
        bookmarked: false
      });
      return await removePublicationBookmark();
    }

    setBookmarkConfig(targetPublication.id, {
      countBookmarks: bookmarksCount + 1,
      bookmarked: true
    });
    return await addPublicationBookmark();
  };

  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        cn(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm'
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        togglePublicationProfileBookmark();
      }}
    >
      <div className="flex items-center space-x-2">
        {hasBookmarked ? (
          <>
            <BookmarkIconSolid className="h-4 w-4" />
            <div>Remove Bookmark</div>
          </>
        ) : (
          <>
            <BookmarkIconOutline className="h-4 w-4" />
            <div>Bookmark</div>
          </>
        )}
      </div>
    </Menu.Item>
  );
};

export default Bookmark;
