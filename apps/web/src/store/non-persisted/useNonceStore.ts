import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
interface State {
  decrementLensHubOnchainSigNonce: () => void;
  incrementLensHubOnchainSigNonce: () => void;
  lensHubOnchainSigNonce: number;
  setLensHubOnchainSigNonce: (lensHubOnchainSigNonce: number) => void;
}

const store = create<State>((set) => ({
  decrementLensHubOnchainSigNonce: () =>
    set((state) => ({
      lensHubOnchainSigNonce: state.lensHubOnchainSigNonce - 1
    })),
  incrementLensHubOnchainSigNonce: () =>
    set((state) => ({
      lensHubOnchainSigNonce: state.lensHubOnchainSigNonce + 1
    })),
  lensHubOnchainSigNonce: 0,
  setLensHubOnchainSigNonce: (lensHubOnchainSigNonce) =>
    set(() => ({ lensHubOnchainSigNonce }))
}));

export const useNonceStore = createTrackedSelector(store);
