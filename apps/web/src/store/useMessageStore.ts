import { IndexDB } from '@lensshare/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import createIdbStorage from './lib/createIdbStorage';
import { initVideoCallData } from '@pushprotocol/restapi/src/lib/video';
import type { video as PushVideo, VideoCallData } from '@pushprotocol/restapi';

interface KeyState {
  pgpPvtKey: string;
  setPgpPvtKey: (currentPgpPvtKey: string) => void;
  videoCallObject: PushVideo.Video | null;
  setVideoCallObject: (videoCallObject: PushVideo.Video | null) => void;
  videoCallData: VideoCallData;
  setVideoCallData: (fn: (data: VideoCallData) => VideoCallData) => void;
}

export const useMessageStore = create(
  persist<KeyState>(
    (set) => ({
      pgpPvtKey: '',
      setPgpPvtKey: (currentPgpPvtKey) =>
        set(() => ({ pgpPvtKey: currentPgpPvtKey })),
      videoCallObject: null,
      setVideoCallObject: (videoCallObject) => set(() => ({ videoCallObject })),
      videoCallData: initVideoCallData,
      setVideoCallData: (fn) =>
        set((state) => ({ videoCallData: fn(state.videoCallData) }))
    }),

    {
      name: IndexDB.MessageStore,
      storage: createIdbStorage()
    }
  )
);

export default useMessageStore;
