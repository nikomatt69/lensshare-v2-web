import { Menu } from '@headlessui/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@lensshare/data/tracking';
import {
  type AnyPublication,
  type PublicationNotInterestedRequest,
  useAddPublicationNotInterestedMutation,
  useUndoPublicationNotInterestedMutation
} from '@lensshare/lens';
import type { ApolloCache } from '@lensshare/lens/apollo';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import cn from '@lensshare/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';

interface NotInterestedProps {
  publication: AnyPublication;
}

const NotInterested: FC<NotInterestedProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const notInterested = targetPublication.operations.isNotInterested;

  const request: PublicationNotInterestedRequest = {
    on: publication.id
  };

  const updateCache = (cache: ApolloCache<any>, notInterested: boolean) => {
    cache.modify({
      id: cache.identify(targetPublication),
      fields: {
        operations: (existingValue) => {
          return { ...existingValue, isNotInterested: notInterested };
        }
      }
    });
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const [addPublicationNotInterested] = useAddPublicationNotInterestedMutation({
    variables: { request },
    onError,
    onCompleted: () => {
      toast.success('Marked as not Interested');
      Leafwatch.track(PUBLICATION.TOGGLE_NOT_INTERESTED, {
        publication_id: publication.id,
        not_interested: true
      });
    },
    update: (cache) => updateCache(cache, true)
  });

  const [undoPublicationNotInterested] =
    useUndoPublicationNotInterestedMutation({
      variables: { request },
      onError,
      onCompleted: () => {
        toast.success('Undo Not interested');
        Leafwatch.track(PUBLICATION.TOGGLE_NOT_INTERESTED, {
          publication_id: publication.id,
          not_interested: false
        });
      },
      update: (cache) => updateCache(cache, false)
    });

  const togglePublicationProfileNotInterested = async () => {
    if (notInterested) {
      return await undoPublicationNotInterested();
    }

    return await addPublicationNotInterested();
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
        togglePublicationProfileNotInterested();
      }}
    >
      <div className="flex items-center space-x-2">
        {notInterested ? (
          <>
            <EyeIcon className="h-4 w-4" />
            <div>Undo Not interested</div>
          </>
        ) : (
          <>
            <EyeSlashIcon className="h-4 w-4" />
            <div>Not interested</div>
          </>
        )}
      </div>
    </Menu.Item>
  );
};

export default NotInterested;
