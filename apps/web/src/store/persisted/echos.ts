import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnyPublication } from '@lensshare/lens';
import { Localstorage } from '@lensshare/data/storage';
interface EchoState {
  selectedTrack: AnyPublication | null;
  setSelectedTrack: (publication: AnyPublication | null) => void;
}

export const useEchoStore = create<EchoState>((set) => ({
  selectedTrack: null,
  setSelectedTrack: (selectedTrack) => set({ selectedTrack })
}));

interface EchosPersistState {
  selectedTrackId: string | null;
  setSelectedTrackId: (selectedTrack: string | null) => void;
}

export const useEchosPersistStore = create(
  persist<EchosPersistState>(
    (set) => ({
      selectedTrackId: null,
      setSelectedTrackId: (selectedTrackId) => set(() => ({ selectedTrackId }))
    }),

    { name: Localstorage.ModeStore }
  )
);

export default useEchoStore;
