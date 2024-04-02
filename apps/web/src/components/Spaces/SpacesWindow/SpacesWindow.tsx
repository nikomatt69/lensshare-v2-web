import { useAppUtils } from '@huddle01/react/app-utils';
import {
  useAcl,
  useEventListener,
  useHuddle01,
  usePeers
} from '@huddle01/react/hooks';

import type { FC } from 'react';
import React, { createRef, useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';

import AvatarGrid from '../Common/AvatarGrid/AvatarGrid';
import InvitationModal from '../Common/InvitationModal';
import Sidebar from '../Common/Sidebar/Sidebar';
import SpacesSummary from './SpacesSummary';
import SpacesWindowBottomBar from './SpacesWindowBottomBar';
import SpaceWindowHeader from './SpaceWindowHeader';

import toast from 'react-hot-toast';

import { useUpdateEffect } from 'usehooks-ts';
import type { HTMLAudioElementWithSetSinkId } from '../Common/SpacesTypes';
import { useSpacesStore } from 'src/store/persisted/spaces';
import { MusicTrack, SpacesEvents } from 'src/enums';
import getAvatar from '@lensshare/lib/getAvatar';

const SpacesWindow: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setDisplayName, changeAvatarUrl, sendData } = useAppUtils();
  const { changePeerRole } = useAcl();
  const { me } = useHuddle01();
  const [showAcceptRequest, setShowAcceptRequest] = useState(false);
  const [requestedPeerId, setRequestedPeerId] = useState('');
  const {
    addRequestedPeers,
    removeRequestedPeers,
    requestedPeers,
    myMusicTrack,
    isMyMusicPlaying,
    activeSpeakerDevice
  } = useSpacesStore();
  const [requestType, setRequestType] = useState('');
  const { peers } = usePeers();
  const [musicTrack, setMusicTrack] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = createRef<HTMLAudioElementWithSetSinkId>();

  const { currentProfile } = useAppStore();

  const setMusicTrackPath = (musicTrack: MusicTrack) => {
    switch (musicTrack) {
      case MusicTrack.CALM_MY_MIND: {
        return '/music/calm_my_mind.mp3';
      }
      case MusicTrack.CRADLE_OF_SOUL: {
        return '/music/cradle_of_soul.mp3';
      }
      case MusicTrack.FOREST_LULLABY: {
        return '/music/forest_lullaby.mp3';
      }
      default: {
        return '';
      }
    }
  };

  useEventListener(SpacesEvents.ROOM_PEER_JOINED, ({ peerId, role }) => {
    if (role === 'peer' && me.role === 'host') {
      changePeerRole(peerId, 'listener');
    }
  });

  useEventListener(SpacesEvents.ROOM_ME_ROLE_UPDATE, (role) => {
    if (role !== 'listener') {
      toast.success(`You are now a ${role}`);
    }
  });

  useEventListener(SpacesEvents.ROOM_DATA_RECEIVED, (data) => {
    if (data.payload['request-to-speak']) {
      setShowAcceptRequest(true);
      setRequestedPeerId(data.payload['request-to-speak']);
      addRequestedPeers(data.payload['request-to-speak']);
      setTimeout(() => {
        setShowAcceptRequest(false);
      }, 5000);
    }
    if (data.payload['requestType']) {
      const requestedType = data.payload['requestType'];
      setRequestType(requestedType);
      if (requestedType.includes('accepted')) {
        const { peerId } = data.payload;
        if (requestedType === 'accepted-speaker-invitation') {
          changePeerRole(peerId, 'speaker');
        } else if (requestedType === 'accepted-coHost-invitation') {
          changePeerRole(peerId, 'coHost');
        }
      } else {
        setShowAcceptRequest(true);
        setTimeout(() => {
          setShowAcceptRequest(false);
        }, 5000);
      }
    }
    if (data.payload['musicTrack']) {
      const {
        musicTrack: musicTrackSelection,
        isMusicPlaying: isMusicTrackPlaying
      } = data.payload;
      setIsMusicPlaying(isMusicTrackPlaying);
      if (musicTrackSelection !== MusicTrack.DEFAULT && isMusicTrackPlaying) {
        setMusicTrack(setMusicTrackPath(musicTrackSelection));
      }
    }
  });

  useEffect(() => {
    if (['host', 'coHost'].includes(me.role)) {
      setMusicTrack(setMusicTrackPath(myMusicTrack));
      setIsMusicPlaying(isMyMusicPlaying);
    }
  }, [myMusicTrack, isMyMusicPlaying, me.role]);

  useEffect(() => {
    if (isMusicPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [audioRef, isMusicPlaying, musicTrack]);

  useUpdateEffect(() => {
    if (activeSpeakerDevice) {
      audioRef.current?.setSinkId(activeSpeakerDevice.deviceId);
    }
  }, [activeSpeakerDevice]);

  useEffect(() => {
    if (changeAvatarUrl.isCallable) {
      changeAvatarUrl(getAvatar(currentProfile));
    }
  }, [changeAvatarUrl, changeAvatarUrl.isCallable, currentProfile]);

  useEffect(() => {
    if (!requestedPeers.includes(requestedPeerId)) {
      setShowAcceptRequest(false);
    }
  }, [requestedPeerId, requestedPeers]);

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
      removeRequestedPeers(requestedPeerId);
    }
    if (requestType) {
      handleAcceptInvitation(requestType);
    }
    setShowAcceptRequest(false);
  };

  return (
    <div className="fixed inset-0 bottom-20 top-auto z-[100] mx-auto flex h-fit w-full grow rounded-xl xl:bottom-14">
      {musicTrack !== MusicTrack.DEFAULT && isMusicPlaying && (
        <audio ref={audioRef} src={musicTrack} loop />
      )}
      <div className="max-w-screen relative mx-auto grow">
        <div className="absolute bottom-0 right-0 ml-auto rounded-xl  border-[1.5px] border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex justify-center">
            {showAcceptRequest && isExpanded && (
              <InvitationModal
                title={
                  requestType === 'speaker-invitation'
                    ? 'You are invited to speak'
                    : requestType === 'coHost-invitation'
                    ? 'You are invited to be a co-host'
                    : 'Peer requested to speak'
                }
                description={
                  requestType === 'speaker-invitation'
                    ? 'Do you want to accept the invitation to speak?'
                    : requestType === 'coHost-invitation'
                    ? 'Do you want to accept the invitation to be a co-host?'
                    : 'Do you want to accept the request to speak?'
                }
                onAccept={handleAccept}
                onClose={() => {
                  setShowAcceptRequest(false);
                  removeRequestedPeers(requestedPeerId);
                }}
              />
            )}
          </div>
          <SpaceWindowHeader
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
          <div className="max-w-[22rem]">
            {isExpanded ? (
              <div className="relative mt-4">
                <div className="absolute bottom-12 right-0 z-10 h-fit">
                  <Sidebar />
                </div>
                <AvatarGrid isLobbyPreview={false} />
                <SpacesWindowBottomBar />
              </div>
            ) : (
              <SpacesSummary />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacesWindow;
