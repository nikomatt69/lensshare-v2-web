import type { AnyPublication } from '@lensshare/lens';
import type { FC } from 'react';
import React from 'react';

import FeedComment from '@components/Comment/FeedComment';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import NoneRelevantFeed from '@components/Comment/NoneRelevantFeed';
type Props = {
  publication: AnyPublication;
};

const ByteComments: FC<Props> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { id, metadata } = targetPublication;
  return (
    <div className=" center-items flex w-full flex-col overflow-y-auto rounded-xl border-0 bg-white pt-3 dark:bg-gray-900/70">
      <FeedComment publication={targetPublication} />
      <div className="my-2">
        <NoneRelevantFeed publication={targetPublication} />
      </div>
    </div>
  );
};

export default ByteComments;
