import { useHuddle01, useLobby, usePeers } from '@huddle01/react/hooks';

import type { FC } from 'react';
import React, { useState } from 'react';


import Avatar from './Avatar';

import { useEffectOnce } from 'usehooks-ts';
import { useSpacesStore } from 'src/store/persisted/spaces';
import { Spinner } from '@lensshare/ui';

interface AvatarGridProps {
  isLobbyPreview: boolean;
}

const AvatarGrid: FC<AvatarGridProps> = ({ isLobbyPreview }) => {
  const { peers } = usePeers();
  const { me } = useHuddle01();
  const { previewPeers } = useLobby();
  const showSpacesWindow = useSpacesStore((state) => state.showSpacesWindow);
  const listenersCount =
    Object.values(peers).filter(({ role }) => role === 'listener').length +
    (me.role === 'listener' ? 1 : 0);
  const [isLoading, setIsLoading] = useState(true);

  useEffectOnce(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  });

  return (
    <div className="w-96">
      {isLobbyPreview && Object.keys(previewPeers).length > 0 ? (
        isLoading ? (
          <div className="flex min-h-[18rem] items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="mx-4 grid min-h-[18rem] grid-cols-5 items-center justify-between gap-5">
            {Object.values(previewPeers).map(({ displayName, avatarUrl }) => (
              <Avatar
                key={displayName}
                displayName={displayName}
                avatarUrl={avatarUrl}
              />
            ))}
          </div>
        )
      ) : (
        <>
          <div className="grid min-h-[8rem] grid-cols-5 items-center justify-between gap-5 self-stretch">
            {showSpacesWindow && me.role !== 'listener' && (
              <Avatar
                key={me.meId}
                peerId={me.meId}
                displayName={me.displayName}
                role={me.role}
                avatarUrl={me.avatarUrl}
              />
            )}
            {Object.values(peers)
              .filter(({ role }) => role !== 'listener')
              .map(({ peerId, displayName, role, avatarUrl, mic }) => (
                <Avatar
                  key={peerId}
                  peerId={peerId}
                  displayName={displayName}
                  role={role}
                  avatarUrl={avatarUrl}
                  mic={mic}
                />
              ))}
          </div>
          <div className="py-4 text-sm font-normal leading-none text-gray-400"></div>
          <div className="grid min-h-[8rem] grid-cols-5 items-center justify-between gap-5 self-stretch pb-6">
            {showSpacesWindow && me.role === 'listener' && (
              <Avatar
                key={me.meId}
                peerId={me.meId}
                displayName={me.displayName}
                role={me.role}
                avatarUrl={me.avatarUrl}
              />
            )}
            {Object.values(peers)
              .filter(({ role }) => role === 'listener')
              .map(({ peerId, displayName, role, avatarUrl, mic }) => (
                <Avatar
                  key={peerId}
                  peerId={peerId}
                  displayName={displayName}
                  role={role}
                  avatarUrl={avatarUrl}
                  mic={mic}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AvatarGrid;
