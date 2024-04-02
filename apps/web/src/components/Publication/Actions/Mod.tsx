import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import type { AnyPublication } from '@lensshare/lens';
import { Tooltip } from '@lensshare/ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';


interface ModProps {
  publication: AnyPublication;
  isFullPublication?: boolean;
}

const Mod: FC<ModProps> = ({ isFullPublication = false, publication }) => {
  const { setShowGardenerActionsAlert } = useGlobalAlertStateStore();

  const iconClassName = isFullPublication
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <motion.button
      aria-label="Mod"
      className="rounded-full p-1.5 text-yellow-600 outline-offset-2 hover:bg-yellow-400/20"
      onClick={() => setShowGardenerActionsAlert(true, publication.id)}
      whileTap={{ scale: 0.9 }}
    >
      <Tooltip content="Mod actions" placement="top" withDelay>
        <ShieldCheckIcon className={iconClassName} />
      </Tooltip>
    </motion.button>
  );
};

export default Mod;