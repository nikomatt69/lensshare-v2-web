
import { IndexDB } from '@lensshare/data/storage';
import { AllowedToken } from '@lensshare/types/hey';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import createIdbStorage from '../lib/createIdbStorage';



interface State {
  allowedTokens: [] | AllowedToken[];
  setAllowedTokens: (allowedTokens: AllowedToken[]) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      allowedTokens: [],
      setAllowedTokens: (allowedTokens) => set(() => ({ allowedTokens }))
    }),
    { name: IndexDB.AllowedTokensStore, storage: createIdbStorage() }
  )
);

export const useAllowedTokensStore = createTrackedSelector(store);
