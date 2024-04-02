/* eslint-disable @typescript-eslint/no-unused-vars */
import FullScreenModal from '@components/Bytes/FullScreenModal';
import { XCircleIcon } from '@heroicons/react/24/outline';
import {
  LimitType,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublicationsQuery
} from '@lensshare/lens';
import type { Post, Profile, PublicationsRequest } from '@lensshare/lens';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/persisted/useAppStore';
import { EmptyState, Image } from '@lensshare/ui';
import getAvatar from '@lensshare/lib/getAvatar';

import { startOfDay, isAfter, parseISO } from 'date-fns';
import LatestBytesShimmer from '@components/Bytes/LatestBytesShimmer';
import {
  LENSTUBE_BYTES_APP_ID,
  APP_ID,
  TAPE_APP_ID,
  SCROLL_ROOT_MARGIN
} from '@lensshare/data/constants';
import { useInView } from 'react-cool-inview';
import ProfileBytes from '@components/Profile/ProfileBytes';
import ProfileBytesLast from '@components/Profile/ProfileBytesLast';
import Loader from '@components/Shared/Loader';

type Props = {
  trigger: React.ReactNode;
  publication: Post;
  profile: Profile;
};

const StoriesRender: FC<Props> = ({ trigger, publication, profile }) => {
  const [show, setShow] = useState(false);
  const [currentViewingId, setCurrentViewingId] = useState('');
  const { currentProfile } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const profilePic = currentProfile?.metadata?.picture;
  const startOfToday = startOfDay(new Date());

  const request: PublicationsRequest = {
    where: {
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.ShortVideo],
        publishedOn: [LENSTUBE_BYTES_APP_ID, APP_ID, TAPE_APP_ID]
      },
      publicationTypes: [PublicationType.Post],
      from: [profile]
    },
    limit: LimitType.Fifty
    // assuming `createdAt` is a field in the `where` object
  };

  const { data, loading, error, fetchMore } = usePublicationsQuery({
    variables: { request },
    skip: !profile.id
  });

  let bytes = data?.publications?.items as Post[];
  const filterTodayPosts = (bytes: Post[]) => {
    const startOfToday = startOfDay(new Date());
    return bytes?.filter((bytes: { createdAt: string }) =>
      isAfter(parseISO(bytes.createdAt), startOfToday)
    );
  };
  bytes = filterTodayPosts(bytes);

  const pageInfo = data?.publications?.pageInfo;

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request
          }
        }
      });
    }
  });

  if (loading) {
    return <Loader />;
  }

  if (data?.publications?.items?.length === 0) {
    return <EmptyState message icon />;
  }

  return (
    <>
      <button
        type="button"
        className="focus:outline-none"
        onClick={() => setShow(true)}
      >
        <div className="md:w-22 md:h-22 h-14 w-14 overflow-y-auto pl-4 md:mx-auto">
          <Image
            src={getAvatar(profile)}
            className="rounded-full"
            alt={profile?.handle?.localName}
            data-testid="profile-avatar"
          />
        </div>
        {trigger}
      </button>
      <FullScreenModal
        panelClassName="max-w-lg bg-[#F2F6F9] dark:bg-black sm:h-[80vh] scrollbar overflow-y-auto  rounded-xl lg:ml-9"
        show={show}
        autoClose
      >
        <div className="z-10 max-md:absolute">
          <button
            type="button"
            className="m-4 rounded-full bg-slate-600 p-1  focus:outline-none"
            onClick={() => setShow(false)}
          >
            <XCircleIcon className="h-4 w-4 text-white" />
          </button>
        </div>
        <div className=" overflow-y-auto">
          
            <ProfileBytesLast
              publication={{
                ...publication,
                createdAt: filterTodayPosts(bytes)
              }}
              profileId={profile.id}
            />
          
        </div>
      </FullScreenModal>
    </>
  );
};

export default StoriesRender;
