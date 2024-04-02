import type { Profile } from '@lensshare/lens';

import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { IndexDB } from '@lensshare/data/storage';
import createIdbStorage from '../lib/createIdbStorage';

interface State {
  currentProfile: null | Profile;
  fallbackToCuratedFeed: boolean;
  setCurrentProfile: (currentProfile: null | Profile) => void;
  setFallbackToCuratedFeed: (fallbackToCuratedFeed: boolean) => void;
  isMute: boolean;
  setMute: (isOn: boolean) => void;
  verifiedMembers: string[];
  setVerifiedMembers: (verifiedMembers: string[]) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      currentProfile: null,
      fallbackToCuratedFeed: false,
      setCurrentProfile: (currentProfile) => set(() => ({ currentProfile })),
      setFallbackToCuratedFeed: (fallbackToCuratedFeed) =>
        set(() => ({ fallbackToCuratedFeed })),
      isMute: true,
      setMute: (isMute: boolean) => set({ isMute }),
      verifiedMembers: [],
      setVerifiedMembers: (verifiedMembers) => set(() => ({ verifiedMembers }))
    }),
    {
      name: IndexDB.ProfileStore,
      storage: createIdbStorage()
    }
  )
);

export const useAppStore = createTrackedSelector(store);
