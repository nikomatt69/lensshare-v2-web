import type { Profile } from '@lensshare/lens';
import type { Group } from '@lensshare/types/hey';
import { QueuedVideoType } from 'src/types/custom-types';
import { create } from 'zustand';

interface AppState {
  currentProfile: Profile | null;
  setCurrentProfile: (currentProfile: Profile | null) => void;
  verifiedMembers: string[];
  setVerifiedMembers: (verifiedMembers: string[]) => void;
  featuredGroups: Group[];
  setFeaturedGroups: (featuredGroups: Group[]) => void;
  isMute: boolean;
  setMute: (isOn: boolean) => void;
  queuedVideos: QueuedVideoType[]
  setQueuedVideos: (queuedVideos: QueuedVideoType[]) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentProfile: null,
  setCurrentProfile: (currentProfile) => set(() => ({ currentProfile })),
  verifiedMembers: [],
  setVerifiedMembers: (verifiedMembers) => set(() => ({ verifiedMembers })),
  queuedVideos: [],
  setQueuedVideos: (queuedVideos) => set({ queuedVideos }),
  featuredGroups: [],
  setFeaturedGroups: (featuredGroups) => set(() => ({ featuredGroups })),
  isMute: true,
  setMute: (isMute: boolean) => set({ isMute })
}));

export const verifiedMembers = () => useAppStore.getState().verifiedMembers;
export const featuredGroups = () => useAppStore.getState().featuredGroups;
