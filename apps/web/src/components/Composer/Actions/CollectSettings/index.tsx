import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { Modal, Tooltip } from '@lensshare/ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useState } from 'react';


import CollectForm from './CollectForm';
import { useCollectModuleStore } from 'src/store/non-persisted/useCollectModuleStore';

const CollectSettings: FC = () => {
  const { reset } = useCollectModuleStore((state) => state);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip content="Collect" placement="top">
        <motion.button
          aria-label="Choose Collect Module"
          className="rounded-full outline-offset-8"
          onClick={() => setShowModal(!showModal)}
          type="button"
          whileTap={{ scale: 0.9 }}
        >
          <RectangleStackIcon className="h-5 w-5 text-brand" />
        </motion.button>
      </Tooltip>
      <Modal
        icon={<RectangleStackIcon className="h-5 w-5 text-brand" />}
        onClose={() => {
          setShowModal(false);
          reset();
        }}
        show={showModal}
        title="Collect Settings"
      >
        <CollectForm setShowModal={setShowModal} />
      </Modal>
    </>
  );
};

export default CollectSettings;