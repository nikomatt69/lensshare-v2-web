import type { AnyPublication, Comment, MirrorablePublication } from '@lensshare/lens';
import type { FC } from 'react';
import React from 'react';

import Feed from '@components/Comment/Feed';
import FeedComment from '@components/Comment/FeedComment';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
type Props = {
  publication: AnyPublication;
};

const ByteComments: FC<Props> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { id, metadata } = targetPublication;
  return (
    <div className=" center-items flex  w-full overflow-y-auto border-0 bg-white pt-3  dark:bg-gray-900/70">
      <FeedComment publication={targetPublication} />
    </div>
  );
};

export default ByteComments;
