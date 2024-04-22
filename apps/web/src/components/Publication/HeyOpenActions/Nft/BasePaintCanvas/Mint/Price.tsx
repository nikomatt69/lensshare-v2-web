import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import getRedstonePrice from '@lib/getRedstonePrice';
import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';

import { useBasePaintMintStore } from '.';

interface PriceProps {
  openEditionPrice: number;
}

const Price: FC<PriceProps> = ({ openEditionPrice }) => {
  const { quantity, setQuantity } = useBasePaintMintStore();
  const { data: usdPrice, isLoading } = useQuery({
    queryKey: ['getRedstonePrice'],
    queryFn: async () => await getRedstonePrice('ETH'),
    enabled: Boolean(openEditionPrice)
  });

  if (isLoading) {
    return null;
  }

  const priceInEth = quantity * openEditionPrice;
  const priceInUsd = usdPrice * priceInEth;

  return (
    <div className="mt-4">
      <div className="divider mb-4" />
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-baseline space-x-2 font-mono">
            <div className="text-2xl">{priceInEth.toFixed(3)}</div>
            <div className="text-sm">ETH</div>
          </div>
          <div className="font-mono text-xs">
            ≈ ${priceInUsd.toFixed(2)} USD
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            disabled={quantity === 1}
            className="rounded-full border p-1.5 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700"
            onClick={() => setQuantity(quantity - 1)}
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="text-xl font-bold">{quantity}</span>
          <button
            className="rounded-full border p-1.5 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700"
            onClick={() => setQuantity(quantity + 1)}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Price;
