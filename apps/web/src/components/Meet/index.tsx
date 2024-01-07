import { useRoom } from '@huddle01/react/hooks';
import type { NextPage } from 'next';

import Lobby from './Lobby';
import Meet from './Meet';
import SpacesWindow from '@components/Common/SpacesWindow/SpacesWindow';

const Main: NextPage = () => {
  const { isRoomJoined } = useRoom();

  return isRoomJoined ? <SpacesWindow /> : <Lobby />;
};

export default Main;
