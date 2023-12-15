import MenuTransition from '@components/Shared/MenuTransition';
import UserProfile from '@components/Shared/UserProfile';
import { Menu } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { HOME } from '@lensshare/data/tracking';
import type {
  FeedItem,
  FeedRequest,
  PaginatedProfileResult,
  Profile
} from '@lensshare/lens';
import {
  CustomFiltersType,
  LimitType,
  useFeedLazyQuery,
  useSearchProfilesLazyQuery
} from '@lensshare/lens';
import getAvatar from '@lensshare/lib/getAvatar';
import getProfile from '@lensshare/lib/getProfile';
import { Image, Input, Spinner } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { motion } from 'framer-motion';
import type { ChangeEvent, FC } from 'react';
import { Fragment, useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useTimelineStore } from 'src/store/useTimelineStore';

const SeeThroughLens: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const seeThroughProfile = useTimelineStore(
    (state) => state.seeThroughProfile
  );
  const setSeeThroughProfile = useTimelineStore(
    (state) => state.setSeeThroughProfile
  );

  const [recommendedProfilesToSeeThrough, setRecommendedProfilesToSeeThrough] =
    useState<Profile[]>([]);
  const [searchText, setSearchText] = useState('');

  const setRecommendedProfiles = (feedItems: FeedItem[]) => {
    let uniqueProfileIds: string[] = [];
    let profiles: Profile[] = [];
    for (const feedItem of feedItems) {
      const profileId = feedItem.root.by.id;
      if (
        !uniqueProfileIds.includes(profileId) &&
        profileId !== seeThroughProfile?.id &&
        profileId !== currentProfile?.id
      ) {
        profiles.push(feedItem.root.by as Profile);
        uniqueProfileIds.push(profileId);
      }
    }
    setRecommendedProfilesToSeeThrough(profiles?.slice(0, 5));
  };

  const profile = seeThroughProfile ?? currentProfile;
  const request: FeedRequest = { where: { for: profile?.id } };

  const [searchUsers, { data: searchUsersData, loading: searchUsersLoading }] =
    useSearchProfilesLazyQuery();

  const [fetchRecommendedProfiles, { loading, error }] = useFeedLazyQuery({
    variables: { request },
    onCompleted: ({ feed }) => {
      const feedItems = feed?.items as FeedItem[];
      setRecommendedProfiles(feedItems);
    }
  });

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value;
    setSearchText(keyword);
    searchUsers({
      variables: {
        request: {
          where: {
            customFilters: [CustomFiltersType.Gardeners]
          },
          query: keyword,
          limit: LimitType.TwentyFive
        }
      }
    });
  };

  const search = searchUsersData?.searchProfiles as PaginatedProfileResult;
  const searchProfiles = search?.items ?? [];
  const recommendedProfiles = recommendedProfilesToSeeThrough ?? [];

  const profiles =
    searchProfiles.length && searchText.length
      ? searchProfiles
      : recommendedProfiles.slice(0, 5);

  return (
    <Menu as="div" className="relative">
      <Menu.Button as={Fragment}>
        <button
          className="flex items-center space-x-1 rounded-md p-1 text-sm hover:bg-gray-300/20"
          onClick={() => fetchRecommendedProfiles()}
        >
          <Image
            src={getAvatar(profile)}
            loading="lazy"
            width={20}
            height={20}
            className="h-5 w-5 rounded-full border bg-gray-200 dark:border-gray-700"
            alt={profile?.id}
          />
          <span>
            {seeThroughProfile ? getProfile(profile).slugWithPrefix : 'My Feed'}
          </span>
          <ChevronDownIcon className="h-4 w-4" />
        </button>
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          static
          className="absolute right-0 z-[5] mt-1 w-64 rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="px-3 pt-2 text-xs">👀 See the feed through...</div>
          <div className="p-2">
            <Input
              type="text"
              className="px-3 py-2 text-sm"
              placeholder="Search"
              value={searchText}
              autoComplete="off"
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
            />
          </div>
          {seeThroughProfile && (
            <button
              className="mb-2 mt-1 w-full bg-gray-200 px-3 py-2 text-left text-sm outline-none dark:bg-gray-700"
              onClick={() => setSeeThroughProfile(null)}
            >
              Reset filter to your own feed
            </button>
          )}
          <div className="mx-2 mb-2">
            {searchUsersLoading || loading ? (
              <div className="space-y-2 px-4 py-2 text-center text-sm font-bold">
                <Spinner size="sm" className="mx-auto" />
                <div>Searching users</div>
              </div>
            ) : (
              <>
                {profiles.map((profile: Profile) => (
                  <Menu.Item
                    as={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
                  <div className="py-4 text-center">No matching users</div>
                ) : null}
              </>
            )}
          </div>
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default SeeThroughLens;
