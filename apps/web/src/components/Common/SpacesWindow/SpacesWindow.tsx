/* eslint-disable @typescript-eslint/no-unused-vars */

import type { FC } from 'react';
import React, { createRef, useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';

import SpaceWindowHeader from './SpaceWindowHeader';
import type { HTMLAudioElementWithSetSinkId } from './SpacesTypes';
import Meet from '@components/Meet/Meet';
import { DynamicIsland } from '@lensshare/ui';

import { useAcl, useHuddle01, usePeers } from '@huddle01/react/hooks';
import { useAppUtils } from '@huddle01/react/app-utils';
import toast from 'react-hot-toast';

const SpacesWindow: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setDisplayName, changeAvatarUrl, sendData } = useAppUtils();
  const { changePeerRole } = useAcl();
  const { me } = useHuddle01();
  const [showAcceptRequest, setShowAcceptRequest] = useState(false);
  const [requestedPeerId, setRequestedPeerId] = useState('');
  const currentProfile = useAppStore((state) => state.currentProfile);

  const [requestType, setRequestType] = useState('');
  const { peers } = usePeers();
  const [musicTrack, setMusicTrack] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = createRef<HTMLAudioElementWithSetSinkId>();

  const handleAcceptInvitation = (requestType: string) => {
    const peerIds = Object.values(peers)
      .filter(({ role }) => role === 'host' || role === 'coHost')
      .map(({ peerId }) => peerId);
    sendData(peerIds, {
      requestType: `accepted-${requestType}`,
      peerId: me.meId
    });
    toast.success('Invitation accepted');
  };

  const handleAccept = () => {
    if (me.role == 'host' || me.role == 'coHost') {
      changePeerRole(requestedPeerId, 'speaker');
    }
    if (requestType) {
      handleAcceptInvitation(requestType);
    }
    setShowAcceptRequest(false);
  };

  return (
    <div className="fixed inset-0 bottom-20 top-auto z-[100] mx-auto flex h-fit w-screen grow rounded-xl xl:bottom-14">
      <div className="max-w-screen relative mx-auto grow rounded-xl">
        <div className="absolute bottom-0 right-0 ml-auto rounded-xl  border-[1.5px] border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex justify-center" />
          <SpaceWindowHeader
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
          <div className="min-w-[22rem]">
            {isExpanded ? <Meet /> : <DynamicIsland />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacesWindow;
