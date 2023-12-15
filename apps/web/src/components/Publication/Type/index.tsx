import type { AnyPublication } from '@lensshare/lens';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import { useRouter } from 'next/router';
import type { FC } from 'react';

import Commented from './Commented';
import Mirrored from './Mirrored';

interface PublicationTypeProps {
  publication: AnyPublication;
  showType: boolean;
  showThread?: boolean;
}

const PublicationType: FC<PublicationTypeProps> = ({
  publication,
  showType,
  showThread = false
}) => {
  const { pathname } = useRouter();
  const type = publication.__typename;

  if (!showType) {
    return null;
  }

  return (
    <span onClick={stopEventPropagation} aria-hidden="true">
      {type === 'Mirror' ? <Mirrored publication={publication} /> : null}
      {type === 'Comment' && (showThread || pathname === '/posts/[id]') ? (
        <Commented publication={publication} />
      ) : null}
    </span>
  );
};

export default PublicationType;
