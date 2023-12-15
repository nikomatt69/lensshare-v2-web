import { PUBLICATION } from '@lensshare/data/tracking';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import type { MarkupLinkProps } from '@lensshare/types/misc';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import type { FC } from 'react';

import Slug from '../../Slug';
import UserPreview from '../../UserPreview';

const Mention: FC<MarkupLinkProps> = ({ title, mentions }) => {
  const handle = title?.slice(1);

  if (!handle) {
    return null;
  }

  const fullHandles = mentions?.map(
    (mention) => mention.snapshotHandleMentioned.fullHandle
  );

  if (!fullHandles?.includes(handle)) {
    return title;
  }

  const canShowUserPreview = (handle: string) => {
    const foundMention = mentions?.find(
      (mention) => mention.snapshotHandleMentioned.fullHandle === handle
    );

    return foundMention?.snapshotHandleMentioned.linkedTo?.nftTokenId
      ? true
      : false;
  };

  const getLocalNameFromFullHandle = (handle: string) => {
    const foundMention = mentions?.find(
      (mention) => mention.snapshotHandleMentioned.fullHandle === handle
    );
    return foundMention?.snapshotHandleMentioned.localName;
  };

  return canShowUserPreview(handle) ? (
    <Link
      href={`/u/${getLocalNameFromFullHandle(handle)}`}
      onClick={(event) => {
        stopEventPropagation(event);
    
      }}
    >
      <UserPreview handle={handle}>
        <Slug
          slug={getLocalNameFromFullHandle(handle)}
          prefix="@"
          useBrandColor
        />
      </UserPreview>
    </Link>
  ) : (
    <Slug slug={getLocalNameFromFullHandle(handle)} prefix="@" useBrandColor />
  );
};

export default Mention;
