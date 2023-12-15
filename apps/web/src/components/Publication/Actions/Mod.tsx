import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import type { AnyPublication } from '@lensshare/lens';
import { Tooltip } from '@lensshare/ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useGlobalAlertStateStore } from 'src/store/useGlobalAlertStateStore';

interface ModProps {
  publication: AnyPublication;
  isFullPublication?: boolean;
}

const Mod: FC<ModProps> = ({ publication, isFullPublication = false }) => {
  const setShowModActionAlert = useGlobalAlertStateStore(
    (state) => state.setShowModActionAlert
  );
  const iconClassName = isFullPublication
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setShowModActionAlert(true, publication)}
      aria-label="Mod"
    >
      <div className="rounded-full p-1.5 text-yellow-600 hover:bg-yellow-400/20">
        <Tooltip placement="top" content="Mod actions" withDelay>
          <ShieldCheckIcon className={iconClassName} />
        </Tooltip>
      </div>
    </motion.button>
  );
};

export default Mod;
