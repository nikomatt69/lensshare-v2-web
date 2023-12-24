import {
  BanknotesIcon,
  HandRaisedIcon,
  HashtagIcon,
  IdentificationIcon,
  LinkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import {
  ACHIEVEMENTS_WORKER_URL,
  APP_NAME,
  IS_MAINNET
} from '@lensshare/data/constants';
import type { Profile } from '@lensshare/lens';
import formatAddress from '@lensshare/lib/formatAddress';
import getFollowModule from '@lensshare/lib/getFollowModule';
import { Card } from '@lensshare/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import type { FC } from 'react';

import MetaDetails from '../MetaDetails';
import Access from './Access';
import ProfileDetails from './ProfileDetails';
import Rank from './Rank';
import { useAppStore } from 'src/store/useAppStore';

interface ProfileStaffToolProps {
  profile: Profile;
}

const ProfileStaffTool: FC<ProfileStaffToolProps> = ({ profile }) => {
  
  const currentProfile = useAppStore((state) => state.currentProfile);

  

  return (
    <Card
      as="aside"
      className="mt-5 border-yellow-400 !bg-yellow-300/20 p-5"
      forceRounded
    >
      <div className="flex items-center space-x-2 text-yellow-600">
        <ShieldCheckIcon className="h-5 w-5" />
        <div className="text-lg font-bold">Staff tool</div>
      </div>
      <div className="mt-3 space-y-2">
        {(
          <MetaDetails
            icon={
              <img
                className="h-4 w-4"
                height={16}
                width={16}
                src="/logo.png"
                alt="Logo"
              />
            }
            value={currentProfile?.id}
          >
            Have used {APP_NAME}
          </MetaDetails>
        ) }
        <MetaDetails
          icon={<HashtagIcon className="lt-text-gray-500 h-4 w-4" />}
          value={currentProfile?.id}
          title="Profile ID"
        >
          {currentProfile?.id}
        </MetaDetails>
        <MetaDetails
          icon={<BanknotesIcon className="lt-text-gray-500 h-4 w-4" />}
          value={currentProfile?.ownedBy.address}
          title="Address"
        >
          {formatAddress(currentProfile?.ownedBy.address)}
        </MetaDetails>
        {currentProfile?.followNftAddress ? (
          <MetaDetails
            icon={<PhotoIcon className="lt-text-gray-500 h-4 w-4" />}
            value={currentProfile?.followNftAddress.address}
            title="NFT address"
          >
            {formatAddress(currentProfile?.followNftAddress.address)}
          </MetaDetails>
        ) : null}
        <MetaDetails
          icon={<HandRaisedIcon className="lt-text-gray-500 h-4 w-4" />}
          value={currentProfile?.signless ? 'Yes' : 'No'}
          title="Has Lens Manager"
        >
          {currentProfile?.signless ? 'Yes' : 'No'}
        </MetaDetails>
        <MetaDetails
          icon={<HandRaisedIcon className="lt-text-gray-500 h-4 w-4" />}
          value={currentProfile?.sponsor ? 'Yes' : 'No'}
          title="Gas sponsored"
        >
          {currentProfile?.sponsor ? 'Yes' : 'No'}
        </MetaDetails>
        <MetaDetails
          icon={<IdentificationIcon className="lt-text-gray-500 h-4 w-4" />}
          value={currentProfile?.id}
          title="Follow module"
        >
          {getFollowModule(currentProfile?.followModule?.__typename).description}
        </MetaDetails>
        {currentProfile?.metadata?.rawURI ? (
          <MetaDetails
            icon={<LinkIcon className="lt-text-gray-500 h-4 w-4" />}
            value={currentProfile?.metadata.rawURI}
            title="Metadata"
          >
            <Link
              href={currentProfile?.metadata.rawURI}
              target="_blank"
              rel="noreferrer"
            >
              Open
            </Link>
          </MetaDetails>
        ) : null}
      </div>
      {IS_MAINNET ? (
        <>
          <ProfileDetails profile={currentProfile?.id} />
          <Rank profile={currentProfile?.id} />
         
        </>
      ) : null}
    </Card>
  );
};

export default ProfileStaffTool;
