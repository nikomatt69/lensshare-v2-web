import type { Profile } from '@lensshare/lens';
import { LimitType, useMutualFollowersQuery } from '@lensshare/lens';
import getAvatar from '@lensshare/lib/getAvatar';
import getProfile from '@lensshare/lib/getProfile';
import { Image } from '@lensshare/ui';
import type { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { useAppStore } from 'src/store/useAppStore';

interface MutualFollowersProps {
  setShowMutualFollowersModal?: Dispatch<SetStateAction<boolean>>;
  profile: Profile;
}

const MutualFollowers: FC<MutualFollowersProps> = ({
  setShowMutualFollowersModal,
  profile
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { data, loading, error } = useMutualFollowersQuery({
    variables: {
      request: {
        viewing: profile?.id,
        observer: currentProfile?.id,
        limit: LimitType.Ten
      }
    },
    skip: !profile?.id || !currentProfile?.id
  });

  const profiles = (data?.mutualFollowers?.items as Profile[]) ?? [];

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <div
      className="lt-text-gray-500 flex cursor-pointer items-center space-x-2.5 text-sm"
      onClick={() => setShowMutualFollowersModal?.(true)}
      aria-hidden="true"
    >
      <div className="contents -space-x-2">
        {profiles?.map((profile) => (
          <Image
            key={profile.id}
            className="h-5 w-5 rounded-full border dark:border-gray-700"
            src={getAvatar(profile)}
            alt={profile.id}
          />
        ))}
      </div>
      <div>
        <span>Followed by </span>
        {children}
      </div>
    </div>
  );

  if (profiles.length === 0 || loading || error) {
    return null;
  }

  const profileOne = profiles[0];
  const profileTwo = profiles[1];
  const profileThree = profiles[2];

  if (profiles?.length === 1) {
    return (
      <Wrapper>
        <span>{getProfile(profileOne).displayName}</span>
      </Wrapper>
    );
  }

  if (profiles?.length === 2) {
    return (
      <Wrapper>
        <span>{getProfile(profileOne).displayName} and </span>
        <span>{getProfile(profileTwo).displayName}</span>
      </Wrapper>
    );
  }

  if (profiles?.length === 3) {
    const calculatedCount = profiles.length - 3;
    const isZero = calculatedCount === 0;

    return (
      <Wrapper>
        <span>{getProfile(profileOne).displayName}, </span>
        <span>
          {getProfile(profileTwo).displayName}
          {isZero ? ' and ' : ', '}
        </span>
        <span>{getProfile(profileThree).displayName} </span>
        {!isZero ? (
          <span>
            and {calculatedCount} {calculatedCount === 1 ? 'other' : 'others'}
          </span>
        ) : null}
      </Wrapper>
    );
  }

  return null;
};

export default MutualFollowers;
