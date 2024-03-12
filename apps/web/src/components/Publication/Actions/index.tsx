import { type AnyPublication } from '@lensshare/lens';
import isOpenActionAllowed from '@lensshare/lib/isOpenActionAllowed';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import type { FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';

import OpenAction from '../LensOpenActions';
import Comment from './Comment';
import Like from './Like';
import Mod from './Mod';
import ShareMenu from './Share';
import Views from './Views';
import { useImpressionsStore } from 'src/store/useImpressionsStore';
import getPublicationViewCountById from '@lib/getPublicationViewCountById';
import { ADMIN_ADDRESS } from '@lensshare/data/constants';
import CommentModal from '@components/Bytes/CommentModal';

interface PublicationActionsProps {
  publication: AnyPublication;
  showCount?: boolean;
}

const PublicationActions: FC<PublicationActionsProps> = ({
  publication,
  showCount = false
}) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const currentProfile = useAppStore((state) => state.currentProfile);

  const hasOpenAction = (targetPublication.openActionModules?.length || 0) > 0;
  const publicationViews = useImpressionsStore(
    (state) => state.publicationViews
  );
  const canMirror = currentProfile
    ? targetPublication.operations.canMirror
    : true;
  const canAct =
    hasOpenAction && isOpenActionAllowed(targetPublication.openActionModules);
  const views = getPublicationViewCountById(
    publicationViews,
    targetPublication
  );

  return (
    <span
      className="-ml-2 mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 sm:gap-8"
      onClick={stopEventPropagation}
      aria-hidden="true"
    >
      <CommentModal publication={publication} />
      {canMirror ? (
        <ShareMenu publication={publication} showCount={showCount} />
      ) : null}
      <Like publication={publication} showCount={showCount} />
      {canAct ? (
        <OpenAction publication={publication} showCount={showCount} />
      ) : null}
      {views ? <Views views={views} showCount={showCount} /> : null}
      {currentProfile?.ownedBy.address === ADMIN_ADDRESS ? (
        <Mod publication={publication} isFullPublication={showCount} />
      ) : null}
    </span>
  );
};

export default PublicationActions;
