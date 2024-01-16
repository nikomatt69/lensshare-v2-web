
import {
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

import type { FC, ReactNode } from 'react';
import React, { useState } from 'react';

import TokenGateForm from './TokenGateForm';

import { motion } from 'framer-motion';
import ScheduleSpacesForm from './ScheduleSpacesMenu';
import { Modal, Tooltip } from '@lensshare/ui';

const SpaceSettings: FC = () => {
  const [showTokenGateModal, setShowTokenGateModal] = useState(false);
  const [showScheduleSpacesModal, setShowScheduleSpacesModal] = useState(false);

  return (
    <div className="flex gap-4">
      <Tooltip placement="top" content={`Token Gate Spaces`}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => setShowTokenGateModal(!showTokenGateModal)}
          aria-label={`Token Gate Spaces`}
        >
          <LockClosedIcon className="text-brand h-5 w-5" />
        </motion.button>
      </Tooltip>
      <Tooltip placement="top" content={`Schedule Spaces`}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => setShowScheduleSpacesModal(!showScheduleSpacesModal)}
          aria-label={`Schedule Spaces`}
        >
          <CalendarIcon className="text-brand h-5 w-5" />
        </motion.button>
      </Tooltip>
      <Modal
        title={`Token Gate Spaces`}
        icon={<LockClosedIcon className="text-brand h-5 w-5" />}
        show={showTokenGateModal}
        onClose={() => setShowTokenGateModal(false)}
      >
        <TokenGateForm />
      </Modal>

      <Modal
        title={`Schedule Spaces`}
        icon={<CalendarIcon className="text-brand h-5 w-5" />}
        show={showScheduleSpacesModal}
        onClose={() => setShowScheduleSpacesModal(false)}
      >
        <ScheduleSpacesForm setShowModal={setShowScheduleSpacesModal} />
      </Modal>
    </div>
  );
};

export default SpaceSettings;
