import React from 'react';

import type { NextPage } from 'next';
import Lobby from './Lobby';
import { useLobby, useRoom } from '@huddle01/react/hooks';
import SpacesWindow from '@components/Common/SpacesWindow/SpacesWindow';
import PreviewSpaces from './PreviewSpaces/PreviewSpaces';
import { useSpacesStore } from 'src/store/persisted/spaces';

const SpacesPage: NextPage = () => {
  const { isRoomJoined } = useRoom();
  const { showSpacesLobby, showSpacesWindow } = useSpacesStore();
  const { joinLobby, isLobbyJoined } = useLobby();
  return isRoomJoined ? <SpacesWindow /> : isLobbyJoined && <PreviewSpaces />;
};

export default SpacesPage;
