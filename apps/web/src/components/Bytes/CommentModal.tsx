import type { AnyPublication, MirrorablePublication } from '@lensshare/lens';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import ByteComments from './ByteComments';
import NewPublication from '@components/Composer/NewPublication';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure
} from '@nextui-org/react';
import * as React from 'react';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';

type Props = {
  publication: AnyPublication;
};

const CommentModal: FC<Props> = ({ publication }) => {
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

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <div className="flex flex-col gap-1 ">
      <button type="button" onClick={onOpen}>
        <div className="lt-text-gray-500 ml-1 flex items-center font-bold">
          <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />
        </div>
      </button>
      <Modal
        isOpen={isOpen}
        placement={'bottom'}
        backdrop="blur"
        onOpenChange={onOpenChange}
        autoFocus={false}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: 'easeOut'
              }
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: 'easeIn'
              }
            }
          }
        }}
      >
        <ModalContent
          autoFocus={false}
          className="h-[flex] max-h-[80vh] justify-between rounded-xl border border-b-0 border-gray-500 bg-white dark:bg-gray-900 "
        >
          <ModalHeader autoFocus />
          <ModalBody
            autoFocus={false}
            className="max-w-lg overflow-y-auto overflow-y-hidden  bg-white dark:bg-gray-900"
          >
            <div className="center-items z-100  flex w-full overflow-y-auto border-0 bg-white pt-4 dark:bg-gray-900/70">
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
            <div />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CommentModal;
