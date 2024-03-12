import type { AnyPublication } from '@lensshare/lens';
import type { FC } from 'react';

import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { RectangleStackIcon as RectangleStackIconSolid } from '@heroicons/react/24/solid';
import { PUBLICATION } from '@lensshare/data/tracking';
import humanize from '@lensshare/lib/humanize';
import nFormatter from '@lensshare/lib/nFormatter';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import { Modal, Tooltip } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { motion } from 'framer-motion';
import plur from 'plur';
import { useState } from 'react';

import List from './List';

interface OpenActionProps {
  publication: AnyPublication;
  showCount: boolean;
}

const OpenAction: FC<OpenActionProps> = ({ publication, showCount }) => {
  const [showOpenActionModal, setShowOpenActionModal] = useState(false);
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const hasActed = targetPublication.operations.hasActed.value;
  const { countOpenActions } = targetPublication.stats;

  const iconClassName = showCount
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <>
      <div
        className={cn(
          hasActed ? 'text-brand-500' : 'ld-text-gray-500',
          'flex items-center space-x-1'
        )}
      >
        <motion.button
          aria-label="Action"
          className={cn(
            hasActed ? 'hover:bg-brand-300/20' : 'hover:bg-gray-300/20',
            'rounded-full p-1.5 outline-offset-2'
          )}
          onClick={() => {
            setShowOpenActionModal(true);
            Leafwatch.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECT, {
              publication_id: publication.id
            });
          }}
          whileTap={{ scale: 0.9 }}
        >
          <Tooltip
            content={`${humanize(countOpenActions)} ${plur(
              'Action',
              countOpenActions
            )}`}
            placement="top"
            withDelay
          >
            {hasActed ? (
              <RectangleStackIconSolid className={iconClassName} />
            ) : (
              <RectangleStackIcon className={iconClassName} />
            )}
          </Tooltip>
        </motion.button>
        {countOpenActions > 0 && !showCount ? (
          <span className="text-[11px] sm:text-xs">
            {nFormatter(countOpenActions)}
          </span>
        ) : null}
      </div>
      <Modal
        icon={<RectangleStackIcon className="w-5 h-5" />}
        onClose={() => setShowOpenActionModal(false)}
        show={showOpenActionModal}
        title="Open Actions"
      >
        <List publication={publication} />
      </Modal>
    </>
  );
};

export default OpenAction;