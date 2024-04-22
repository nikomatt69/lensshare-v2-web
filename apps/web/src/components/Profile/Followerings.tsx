import { UsersIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@lensshare/data/tracking';
import type { Profile } from '@lensshare/lens';
import humanize from '@lensshare/lib/humanize';
import { Modal } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import plur from 'plur';
import type { FC } from 'react';
import { useState } from 'react';

import Followers from './Followers';
import Following from './Following';

interface FolloweringsProps {
  profile: Profile;
}

const Followerings: FC<FolloweringsProps> = ({ profile }) => {
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  return (
    <div className="flex gap-8">
      <button
        type="button"
        className="text-left"
        onClick={() => {
          setShowFollowingModal(!showFollowingModal);
       
        }}
      >
        <div className="text-xl">{humanize(profile.stats.following)}</div>
        <div className="lt-text-gray-500">
          {plur('Following', profile.stats.following)}
        </div>
      </button>
      <button
        type="button"
        className="text-left"
        onClick={() => {
          setShowFollowersModal(!showFollowersModal);
    
        }}
      >
        <div className="text-xl">{humanize(profile.stats.followers)}</div>
        <div className="lt-text-gray-500">
          {plur('Follower', profile.stats.followers)}
        </div>
      </button>
      <Modal
        title="Following"
        icon={<UsersIcon className="text-brand h-5 w-5" />}
        show={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
      >
        <Following profile={profile} />
      </Modal>
      <Modal
        title="Followers"
        icon={<UsersIcon className="text-brand h-5 w-5" />}
        show={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
      >
        <Followers profile={profile} />
      </Modal>
    </div>
  );
};

export default Followerings;
