import { IndexDB } from '@lensshare/data/storage';
import type { Profile } from '@lensshare/lens';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import createIdbStorage from './lib/createIdbStorage';

interface ProfileState {
  currentProfile: Profile | null;
  setCurrentProfile: (currentProfile: Profile | null) => void;
}

export const useProfileStore = create(
  persist<ProfileState>(
    (set) => ({
      currentProfile: null,
      setCurrentProfile: (currentProfile) => set(() => ({ currentProfile }))
    }),
    {
      name: IndexDB.ProfileStore,
      storage: createIdbStorage()
    }
  )
);

export default useProfileStore;
