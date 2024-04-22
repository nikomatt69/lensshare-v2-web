import { Bars3BottomLeftIcon } from '@heroicons/react/24/solid';
import { Tooltip } from '@lensshare/ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';


const PollSettings: FC = () => {
  
  const { setShowPollEditor, showPollEditor, resetPollConfig } =
  usePublicationStore();
  return (
    <Tooltip placement="top" content="Poll">
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => {
          resetPollConfig();
          setShowPollEditor(!showPollEditor);
        }}
        aria-label="Poll"
      >
        <Bars3BottomLeftIcon className="text-brand h-5 w-5" />
      </motion.button>
    </Tooltip>
  );
};

export default PollSettings;
