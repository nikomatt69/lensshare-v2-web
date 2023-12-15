import CommentOutline from '@components/Icons/CommentOutline';
import { XCircleIcon } from '@heroicons/react/24/outline';
import type { AnyPublication, MirrorablePublication } from '@lensshare/lens';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import FullScreenModal from './FullScreenModal';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import ByteComments from './ByteComments';
import NewPublication from '@components/Composer/NewPublication';

type Props = {
  trigger: React.ReactNode;
  publication: AnyPublication;
};

const CommentModal: FC<Props> = ({ trigger, publication }) => {
  const [show, setShow] = useState(false);
  const subscriber = publication.by;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [following, setFollowing] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { id, metadata } = targetPublication;

  useEffect(() => {
    if (subscriber?.operations?.isFollowedByMe.value) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
    if (!currentProfile) {
      setFollowing(false);
    }
  }, [currentProfile, subscriber]);
  return (
    <>
      <button
        type="button"
        className="my-auto focus:outline-none"
        onClick={() => setShow(true)}
      >
        <div className="lt-text-gray-500 flex items-center space-x-1 pr-3 font-bold">
          <CommentOutline className="h-4 w-4" />
        </div>
        {trigger}
      </button>
      <FullScreenModal
        panelClassName="max-w-lg bg-[#F2F6F9] dark:bg-black overflow-y-hidden overflow-y-auto rounded-xl lg:ml-9"
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
        <div className="center-items z-100 flex  w-full overflow-y-auto border-0 bg-white pt-10 dark:bg-gray-900/70">
          <ByteComments
            publication={targetPublication as MirrorablePublication}
          />
        </div>
        {currentProfile ? (
          <NewPublication
            publication={targetPublication as AnyPublication}
            isNew
          />
        ) : null}
      </FullScreenModal>
    </>
  );
};

export default CommentModal;
