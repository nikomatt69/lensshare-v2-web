import type { Comment } from '@lensshare/lens';
import type { FC } from 'react';

import ThreadBody from '../ThreadBody';

interface CommentedProps {
  publication: Comment;
}

const Commented: FC<CommentedProps> = ({ publication }) => {
  const commentOn: Comment | any = publication?.commentOn;
  const root = commentOn?.root;

  return (
    <>
      {root ? <ThreadBody publication={root} /> : null}
      <ThreadBody publication={commentOn} />
    </>
  );
};

export default Commented;
