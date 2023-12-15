import Loader from '@components/Shared/Loader';
import { GifIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@lensshare/data/tracking';
import type { IGif } from '@lensshare/types/giphy';
import { Modal, Tooltip } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useState } from 'react';
import { usePublicationStore } from 'src/store/usePublicationStore';

const GifSelector = dynamic(() => import('./GifSelector'), {
  loading: () => <Loader message="Loading GIFs" />
});

interface GiphyProps {
  setGifAttachment: (gif: IGif) => void;
}

const Gif: FC<GiphyProps> = ({ setGifAttachment }) => {
  const attachments = usePublicationStore((state) => state.attachments);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip placement="top" content="GIF">
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => {
            setShowModal(!showModal);
         
          }}
          disabled={attachments.length >= 4}
          aria-label="Choose GIFs"
        >
          <GifIcon className="text-brand h-5 w-5" />
        </motion.button>
      </Tooltip>
      <Modal
        title="Select GIF"
        icon={<PhotoIcon className="text-brand h-5 w-5" />}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <GifSelector
          setShowModal={setShowModal}
          setGifAttachment={setGifAttachment}
        />
      </Modal>
    </>
  );
};

export default Gif;
