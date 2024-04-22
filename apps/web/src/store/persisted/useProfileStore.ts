import type { Profile } from '@lensshare/lens';

import { IndexDB } from '@lensshare/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';
import { createTrackedSelector } from 'react-tracked';

interface State {
  currentProfile: null | Profile;
  fallbackToCuratedFeed: boolean;
  setCurrentProfile: (currentProfile: null | Profile) => void;
  setFallbackToCuratedFeed: (fallbackToCuratedFeed: boolean) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      currentProfile: null,
      fallbackToCuratedFeed: false,
      setCurrentProfile: (currentProfile) => set(() => ({ currentProfile })),
      setFallbackToCuratedFeed: (fallbackToCuratedFeed) =>
        set(() => ({ fallbackToCuratedFeed }))
    }),
    {
      name: IndexDB.ProfileStore,
      storage: createIdbStorage()
    }
  )
);

export const useProfileStore = createTrackedSelector(store);
