import type { Group } from '@lensshare/types/hey';

import { IndexDB } from '@lensshare/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface FeaturedGroupsState {
  featuredGroups: Group[];
  hydrateFeaturedGroups: () => { featuredGroups: Group[] };
  setFeaturedGroups: (featuredGroups: Group[]) => void;
}

export const useFeaturedGroupsStore = create(
  persist<FeaturedGroupsState>(
    (set, get) => ({
      featuredGroups: [],
      hydrateFeaturedGroups: () => {
        return {
          featuredGroups: get().featuredGroups
        };
      },
      setFeaturedGroups: (featuredGroups) => set(() => ({ featuredGroups }))
    }),
    {
      name: IndexDB.FeatureFlagsStore,
      storage: createIdbStorage()
    }
  )
);

export const hydrateFeaturedGroups = () =>
  useFeaturedGroupsStore.getState().hydrateFeaturedGroups();
