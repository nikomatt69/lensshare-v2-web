import Loader from '@components/Shared/Loader';
import MenuTransition from '@components/Shared/MenuTransition';
import UserProfile from '@components/Shared/UserProfile';
import { Menu } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { HOME } from '@lensshare/data/tracking';
import type {
  FeedItem,
  FeedRequest,
  FollowingRequest,
  PaginatedProfileResult,
  Profile
} from '@lensshare/lens';
import {
  CustomFiltersType,
  LimitType,
  useFeedLazyQuery,
  useFollowingLazyQuery,
  useSearchProfilesLazyQuery
} from '@lensshare/lens';
import getAvatar from '@lensshare/lib/getAvatar';
import getLennyURL from '@lensshare/lib/getLennyURL';
import getProfile from '@lensshare/lib/getProfile';
import { Image, Input, Spinner } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { motion } from 'framer-motion';
import type { ChangeEvent, FC } from 'react';
import { Fragment, useState } from 'react';
import { useTimelineStore } from 'src/store/non-persisted/useTimelineStore';
import { useAppStore } from 'src/store/persisted/useAppStore';



const SeeThroughLens: FC = () => {
  const { currentProfile, fallbackToCuratedFeed } = useAppStore();
  const { seeThroughProfile, setSeeThroughProfile } = useTimelineStore();

  const [followingProfilesToSeeThrough, setFollowingProfilesToSeeThrough] =
    useState<Profile[]>([]);
  const [searchText, setSearchText] = useState('');

  const profile = seeThroughProfile || currentProfile;
  const request: FollowingRequest = {
    for: currentProfile?.id,
    limit: LimitType.Fifty
  };

  const [searchUsers, { data: searchUsersData, loading: searchUsersLoading }] =
    useSearchProfilesLazyQuery();

  const [fetchFollowingProfiles, { error, loading }] = useFollowingLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted: ({ following }) => {
      const followings = following?.items as Profile[];
      setFollowingProfilesToSeeThrough(
        followings.sort(() => Math.random() - Math.random()).slice(0, 5)
      );
    },
    variables: { request }
  });

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value;
    setSearchText(keyword);
    searchUsers({
      variables: {
        request: {
          limit: LimitType.Ten,
          query: keyword,
          where: { customFilters: [CustomFiltersType.Gardeners] }
        }
      }
    });
  };

  const search = searchUsersData?.searchProfiles as PaginatedProfileResult;
  const searchProfiles = search?.items || [];
  const followingProfiles = followingProfilesToSeeThrough || [];

  const profiles =
    searchProfiles.length && searchText.length
      ? searchProfiles.slice(0, 5)
      : followingProfiles;

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button as={Fragment}>
            <button
              className="flex items-center space-x-1 rounded-md p-1 text-sm hover:bg-gray-300/20"
              onClick={() => {
                if (!open) {
                  fetchFollowingProfiles();
                }
              }}
              type="button"
            >
              <Image
                alt={profile?.id}
                className="h-5 w-5 rounded-full border bg-gray-200 dark:border-gray-700"
                height={20}
                loading="lazy"
                onError={({ currentTarget }) => {
                  currentTarget.src = getLennyURL(profile?.id);
                }}
                src={getAvatar(profile)}
                width={20}
              />
              <span>
                {seeThroughProfile
                  ? getProfile(profile).slugWithPrefix
                  : fallbackToCuratedFeed
                    ? 'Curated Feed'
                    : 'My Feed'}
              </span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
          </Menu.Button>
          <MenuTransition>
            <Menu.Items
              className="absolute right-0 z-[5] mt-1 w-64 rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
              static
            >
              <div className="mx-3 mt-2 text-xs">
                👀 See the feed through...
              </div>
              <div className="p-2">
                <Input
                  autoComplete="off"
                  className="px-3 py-2 text-sm"
                  iconRight={
                    <XMarkIcon
                      className={cn(
                        'cursor-pointer',
                        searchText ? 'visible' : 'invisible'
                      )}
                      onClick={() => setSearchText('')}
                    />
                  }
                  onChange={handleSearch}
                  placeholder="Search"
                  type="text"
                  value={searchText}
                />
              </div>
              {seeThroughProfile && (
                <button
                  className="mb-2 mt-1 w-full bg-gray-200 px-3 py-2 text-left text-sm outline-none dark:bg-gray-700"
                  onClick={() => setSeeThroughProfile(null)}
                  type="reset"
                >
                  Reset filter to your own feed
                </button>
              )}
              <div className="mx-2 mb-2">
                {searchUsersLoading || loading ? (
                  <Loader  message="Searching users" />
                ) : (
                  <>
                    {profiles.map((profile: Profile) => (
                      <Menu.Item
                        as="div"
                        className={({ active }) =>
                          cn(
                            { 'dropdown-active': active },
                            'cursor-pointer overflow-hidden rounded-lg p-1'
                          )
                        }
                        key={profile.id}
                        onClick={() => {
                          setSeeThroughProfile(profile);
                          setSearchText('');
                          Leafwatch.track(HOME.SELECT_USER_FEED, {
                            see_through_profile: profile.id
                          });
                        }}
                      >
                        <UserProfile
                          
                          
                          linkToProfile={false}
                          profile={profile}
                          showUserPreview={false}
                        />
                      </Menu.Item>
                    ))}
                    {profiles.length === 0 || error ? (
                      <div className="py-4 text-center">
                        Not following anyone
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </Menu.Items>
          </MenuTransition>
        </>
      )}
    </Menu>
  );
};

export default SeeThroughLens;
