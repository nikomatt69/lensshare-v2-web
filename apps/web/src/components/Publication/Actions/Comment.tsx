import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import type { AnyPublication } from '@lensshare/lens';
import humanize from '@lensshare/lib/humanize';
import nFormatter from '@lensshare/lib/nFormatter';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import { Tooltip } from '@lensshare/ui';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { FC } from 'react';

interface CommentProps {
  publication: AnyPublication;
  showCount: boolean;
}

const Comment: FC<CommentProps> = ({ publication, showCount }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const count = targetPublication?.stats?.comments;
  const iconClassName = showCount
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <div className="lt-text-gray-500 flex items-center space-x-1">
      <motion.button whileTap={{ scale: 0.9 }} aria-label="Comment">
        <Link href={`/posts/${publication.id}`}>
          <div className="rounded-full p-1.5 hover:bg-gray-300/20">
            <Tooltip
              placement="top"
              content={count > 0 ? `${humanize(count)} Comments` : 'Comment'}
              withDelay
            >
              <ChatBubbleOvalLeftEllipsisIcon className={iconClassName} />
            </Tooltip>
          </div>
        </Link>
      </motion.button>
      {count > 0 && !showCount ? (
        <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>
      ) : null}
    </div>
  );
};

export default Comment;
