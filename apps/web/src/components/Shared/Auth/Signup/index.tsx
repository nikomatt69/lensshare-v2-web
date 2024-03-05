import type { FC } from 'react';

import SwitchNetwork from '@components/Shared/SwitchNetwork';
import { CHAIN_ID } from 'src/constants';
import { useAccount, useChainId } from 'wagmi';
import { create } from 'zustand';

import WalletSelector from '../WalletSelector';
import ChooseHandle from './ChooseHandle';
import Minting from './Minting';
import Success from './Success';

interface SignupState {
  profileId: string;
  choosedHandle: string;
  screen: 'choose' | 'minting' | 'success';
  setChoosedHandle: (handle: string) => void;
  setProfileId: (id: string) => void;
  setScreen: (screen: 'choose' | 'minting' | 'success') => void;
  setTransactionHash: (hash: string) => void;
  transactionHash: string;
}

export const useSignupStore = create<SignupState>((set) => ({
  screen: 'choose',
  choosedHandle: '',
  profileId: '',
  setChoosedHandle: (handle) => set({ choosedHandle: handle }),
  setProfileId: (id) => set({ profileId: id }),
  setScreen: (screen) => set({ screen }),
  setTransactionHash: (hash) => set({ transactionHash: hash }),
  transactionHash: ''
}));

const Signup: FC = () => {
  const screen = useSignupStore((state) => state.screen);

  const chain = useChainId();
  const { connector: activeConnector } = useAccount();

  return activeConnector?.id ? (
    <div className="space-y-2.5">
      {chain === CHAIN_ID ? (
        screen === 'choose' ? (
          <ChooseHandle />
        ) : screen === 'minting' ? (
          <Minting />
        ) : (
          <Success />
        )
      ) : (
        <SwitchNetwork toChainId={CHAIN_ID} />
      )}
    </div>
  ) : (
    <WalletSelector />
  );
};

export default Signup;
