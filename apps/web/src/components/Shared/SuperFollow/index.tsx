import { StarIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@lensshare/data/tracking';
import type { Profile } from '@lensshare/lens';
import getProfile from '@lensshare/lib/getProfile';
import { Button, Modal } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useGlobalModalStateStore } from 'src/store/useGlobalModalStateStore';

import Loader from '../Loader';
import Slug from '../Slug';

const FollowModule = dynamic(() => import('./FollowModule'), {
  loading: () => <Loader message="Loading Super follow" />
});

interface SuperFollowProps {
  profile: Profile;
  setFollowing: (following: boolean) => void;
  showText?: boolean;
  again?: boolean;

  // For data analytics
  superFollowPosition?: number;
  superFollowSource?: string;
}

const SuperFollow: FC<SuperFollowProps> = ({
  profile,
  setFollowing,
  showText = false,
  again = false,
  superFollowPosition,
  superFollowSource
}) => {
  const [showFollowModal, setShowFollowModal] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );

  return (
    <>
      <Button
        className="!px-3 !py-1.5 text-sm"
        outline
        onClick={() => {
          if (!currentProfile) {
            setShowAuthModal(true);
            return;
          }
          setShowFollowModal(!showFollowModal);

        }}
        aria-label="Super follow"
        icon={<StarIcon className="h-4 w-4" />}
      >
        {showText ? 'Super follow' : null}
      </Button>
      <Modal
        title={
          <span>
            Super follow <Slug slug={getProfile(profile).slugWithPrefix} />{' '}
            {again ? 'again' : ''}
          </span>
        }
        icon={<StarIcon className="h-5 w-5 text-pink-500" />}
        show={showFollowModal}
        onClose={() => setShowFollowModal(false)}
      >
        <FollowModule
          profile={profile}
          setFollowing={setFollowing}
          setShowFollowModal={setShowFollowModal}
          again={again}
          superFollowPosition={superFollowPosition}
          superFollowSource={superFollowSource}
        />
      </Modal>
    </>
  );
};

export default SuperFollow;
