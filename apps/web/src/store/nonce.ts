import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface NonceState {
  userSigNonce: number;
  setUserSigNonce: (userSigNonce: number) => void;
  lensHubOnchainSigNonce: number;
  setLensHubOnchainSigNonce: (nonce: number) => void;
}

export const useNonceStore = create(
  subscribeWithSelector<NonceState>((set) => ({
    userSigNonce: 0,
    setUserSigNonce: (userSigNonce) => set(() => ({ userSigNonce })),
    lensHubOnchainSigNonce: 0,
    setLensHubOnchainSigNonce: (nonce: number) =>
      set(() => ({ lensHubOnchainSigNonce: nonce }))
  }))
);
