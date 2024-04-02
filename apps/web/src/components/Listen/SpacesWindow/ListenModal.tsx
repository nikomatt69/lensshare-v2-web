import type { AnyPublication } from '@lensshare/lens';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/persisted/useAppStore';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import { isMobile } from 'react-device-detect';
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure
} from '@nextui-org/react';
import * as React from 'react';
import Listen from '..';
import MusicOutline from '@components/Icons/MusicOutline';

type Props = {
  publication: AnyPublication;
};

const ListenModal: FC<Props> = ({ }) => {

 


  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <div className="flex flex-col gap-1 ">
      {isMobile ? (
        <button type="button" onClick={onOpen}>
          <div className="lt-text-gray-500 ml-1 flex items-center font-bold">
            <span className="absolute right-0 mx-2 flex-col ">
              <MusicOutline className="h-4 w-4 text-brand-500" />
            </span>
          </div>
        </button>
      ) : null}

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
          className="h-[flex] max-h-[100vh] justify-between rounded-xl border border-b-0 border-gray-500 bg-white dark:bg-gray-900 "
        >
          <ModalBody
            autoFocus={false}
            className="flex max-w-lg overflow-y-auto overflow-y-hidden rounded-xl bg-white dark:bg-gray-900"
          >
            <Listen />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ListenModal;
