import { BasePaint } from '@lensshare/abis';
import { BASEPAINT_CONTRACT } from '@lensshare/data/contracts';
import type { AnyPublication } from '@lensshare/lens';
import type { BasePaintCanvas } from '@lensshare/types/nft';
import type { FC } from 'react';
import { formatEther } from 'viem';
import { base } from 'viem/chains';
import { useContractRead } from 'wagmi';
import { create } from 'zustand';

import Metadata from './Metadata';
import MintAction from './MintAction';
import Price from './Price';

interface BasePaintMintState {
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export const useBasePaintMintStore = create<BasePaintMintState>((set) => ({
  quantity: 1,
  setQuantity: (quantity) => set({ quantity })
}));

interface MintProps {
  canvas: BasePaintCanvas;
  publication: AnyPublication;
}

const Mint: FC<MintProps> = ({ canvas, publication }) => {
  const { data, isSuccess } = useContractRead({
    address: BASEPAINT_CONTRACT,
    abi: BasePaint,
    functionName: 'openEditionPrice',
    chainId: base.id
  });

  const openEditionPrice = parseInt(data?.toString() || '0');
  const etherPrice = parseFloat(formatEther(BigInt(openEditionPrice)));

  return (
    <div className="p-5">
      <div className="mb-4">
        <div className="mb-1 text-xl font-bold">
          Day #{canvas.id}: {canvas.theme}
        </div>
      </div>
      <Metadata canvas={canvas} />
      {isSuccess ? (
        <>
          <Price openEditionPrice={etherPrice} />
          <MintAction
            canvas={canvas}
            openEditionPrice={etherPrice}
            publication={publication}
          />
        </>
      ) : null}
    </div>
  );
};

export default Mint;
