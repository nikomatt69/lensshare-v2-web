import { IndexDB, Localstorage } from '@lensshare/data/storage';
import { delMany } from 'idb-keyval';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Tokens {
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthState {
  accessToken: Tokens['accessToken'];
  refreshToken: Tokens['refreshToken'];
  signIn: (tokens: { accessToken: string; refreshToken: string }) => void;
  signOut: () => void;
  hydrateAuthTokens: () => Tokens;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      signIn: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      signOut: async () => {
        // Clear Localstorage
        const allLocalstorageStores = Object.values(Localstorage).filter(
          (value) => value !== Localstorage.LeafwatchStore
        );
        for (const store of allLocalstorageStores) {
          localStorage.removeItem(store);
        }
        const keys = Object.keys(localStorage).filter((key) =>
          key.startsWith('xmtp/production/')
        );
        for (const key of keys) {
          localStorage.removeItem(key);
        }

        // Clear IndexedDB
        const allIndexedDBStores = Object.values(IndexDB).filter(
          (value) =>
            value !== IndexDB.AlgorithmStore &&
            value !== IndexDB.VerifiedMembersStore &&
            value !== IndexDB.FeaturedGroupsStore &&
            value !== IndexDB.TBAStore
        );
        await delMany(allIndexedDBStores);
      },
      hydrateAuthTokens: () => {
        return {
          accessToken: get().accessToken,
          refreshToken: get().refreshToken
        };
      }
    }),
    { name: Localstorage.AuthStore }
  )
);

export default useAuthStore;

export const signIn = (tokens: { accessToken: string; refreshToken: string }) =>
  useAuthStore.getState().signIn(tokens);
export const signOut = () => useAuthStore.getState().signOut();
export const hydrateAuthTokens = () =>
  useAuthStore.getState().hydrateAuthTokens();
