import React from 'react';
import SpacesWindow from './SpacesWindow/SpacesWindow';
import { useSpacesStore } from 'src/store/persisted/spaces';
import type { NextPage } from 'next';
import Lobby from './Lobby';
import { useRoom } from '@huddle01/react/hooks';

const Spaces: NextPage = () => {
  const { isRoomJoined } = useRoom();
  const { showSpacesLobby, showSpacesWindow } = useSpacesStore();

  return isRoomJoined
    ? showSpacesWindow && <SpacesWindow />
    : showSpacesLobby && <Lobby />;
};

export default Spaces;
