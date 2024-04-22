/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AnyPublication } from '@lensshare/lens';
import type { FC } from 'react';
import { useState } from 'react';
import CommentModal from './CommentModal';
import Like from '@components/Publication/Actions/Like';
import ShareMenu from '@components/Publication/Actions/Share';
import OpenAction from '@components/Publication/LensOpenActions';
import PublicationMenu from '@components/Publication/Actions/Menu';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import { useAppStore } from 'src/store/persisted/useAppStore';

import isOpenActionAllowed from '@lensshare/lib/isOpenActionAllowed';
import getPublicationViewCountById from '@lib/getPublicationViewCountById';
import { useImpressionsStore } from 'src/store/non-persisted/useImpressionsStore';

type Props = {
  video: AnyPublication;
};

const ByteActions: FC<Props> = ({ video }) => {
  const [showShare, setShowShare] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const {isMute,setMute} = useAppStore();
  const [isPlaying, setPlay] = useState(true);

  const vidEl = document.querySelector(`#currentVideo`);
  const handleClickMute = (e: any) => {
    e.stopPropagation();
    const elVol =
      vidEl && vidEl.querySelectorAll<HTMLButtonElement>(`button[volume]`)[0];
    if (!elVol) {
      return;
    }
    const vol = elVol.getAttribute('title');
    const isMuted = vol ? vol?.includes('Mute') : false;
    if (isMute) {
      isMuted && elVol.click();
    } else {
      !isMuted && elVol.click();
    }
    setMute(isMuted);
  };
  const targetPublication = isMirrorPublication(video) ? video.mirrorOn : video;
  const { currentProfile } = useAppStore();

  const hasOpenAction = (targetPublication.openActionModules?.length || 0) > 0;
  const {publicationViews} = useImpressionsStore();
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
    <div className="w-12 flex-col items-center justify-between gap-5 md:flex md:w-14">
      <div className="flex justify-center space-y-4 p-2 md:flex-col" />
      <PublicationMenu publication={targetPublication as AnyPublication} />
      <div className="items-center space-y-1.5 pt-2.5 md:flex md:flex-col">
        <div className=" text-white md:text-inherit">
          <Like publication={targetPublication} showCount={false} />
        </div>
        <div className="  text-center text-white md:pr-4  md:text-inherit">
          <CommentModal publication={targetPublication} />
        </div>
        <button className="mt-0.5  dark:text-white ">
          <ShareMenu
            publication={targetPublication as AnyPublication}
            showCount={false}
          />
        </button>
        {canAct ? (
          <OpenAction
            publication={targetPublication as AnyPublication}
            showCount={false}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ByteActions;
