import React from 'react';

import type { NextPage } from 'next';
import Lobby from './Lobby';
import { useRoom } from '@huddle01/react/hooks';
import SpacesWindow from '@components/Common/SpacesWindow/SpacesWindow';

const SpacesPage: NextPage = () => {
  const { isRoomJoined } = useRoom();

  return isRoomJoined ? <SpacesWindow /> : <Lobby />;
};

export default SpacesPage;
