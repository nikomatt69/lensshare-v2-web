import { Bars3BottomLeftIcon } from '@heroicons/react/24/solid';
import { Tooltip } from '@lensshare/ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';

const MarketSettings: FC = () => {
  const { setShowMarketEditor, showMarketEditor, resetMarketConfig } =
    usePublicationStore();

  return (
    <Tooltip placement="top" content="Market">
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => {
          resetMarketConfig();
          setShowMarketEditor(!showMarketEditor);
        }}
        aria-label="Market"
      >
        <Bars3BottomLeftIcon className="text-brand h-5 w-5" />
      </motion.button>
    </Tooltip>
  );
};

export default MarketSettings;
