import type { FC } from 'react';

import { SquaresPlusIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { Modal, Tooltip } from '@lensshare/ui';
import { motion } from 'framer-motion';


import OpenActionsList from './OpenActionsList';
import { ScreenType, useOpenActionStore } from 'src/store/non-persisted/useOpenActionStore';

const OpenActionSettings: FC = () => {
  const screen = useOpenActionStore((state) => state.screen);
  const setScreen = useOpenActionStore((state) => state.setScreen);
  const showModal = useOpenActionStore((state) => state.showModal);
  const setShowModal = useOpenActionStore((state) => state.setShowModal);
  const selectedOpenAction = useOpenActionStore(
    (state) => state.selectedOpenAction
  );
  const reset = useOpenActionStore((state) => state.reset);

  return (
    <>
      <Tooltip content="Open Action" placement="top">
        <motion.button
          aria-label="Choose Open Action"
          className="outline-brand-500 rounded-full outline-offset-8"
          onClick={() => setShowModal(!showModal)}
          type="button"
          whileTap={{ scale: 0.9 }}
        >
          <SquaresPlusIcon className="text-brand-500 w-5 h-5" />
        </motion.button>
      </Tooltip>
      <Modal
        icon={
          screen === ScreenType.List && (
            <SquaresPlusIcon className="text-brand-500 w-5 h-5" />
          )
        }
        onClose={() => {
          setShowModal(false);
          reset();
        }}
        show={showModal}
        title={
          screen === ScreenType.List ? (
            'Open Action Settings'
          ) : (
            <button
              className="flex items-center space-x-2"
              onClick={() => {
                setScreen(ScreenType.List);
                reset();
              }}
            >
              <ChevronLeftIcon className="mt-0.5 w-4 h-4 stroke-black" />
              <div>{selectedOpenAction}</div>
            </button>
          )
        }
      >
        <OpenActionsList />
      </Modal>
    </>
  );
};

export default OpenActionSettings;
