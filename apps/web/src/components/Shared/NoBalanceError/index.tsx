import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import { PUBLICATION } from '@lensshare/data/tracking';
import type { Amount } from '@lensshare/lens';
import getUniswapURL from '@lensshare/lib/getUniswapURL';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import type { FC } from 'react';

import WrapWmatic from './WrapWmatic';

interface NoBalanceErrorProps {
  moduleAmount: Amount;
}

const NoBalanceError: FC<NoBalanceErrorProps> = ({ moduleAmount }) => {
  const amount = moduleAmount?.value;
  const currency = moduleAmount?.asset?.symbol;
  const assetAddress = moduleAmount?.asset?.contract.address;

  if (currency === 'WMATIC') {
    return <WrapWmatic moduleAmount={moduleAmount} />;
  }

  return (
    <div className="space-y-1">
      <div className="text-sm">
        You don't have enough <b>{currency}</b>
      </div>
      <Link
        href={getUniswapURL(parseFloat(amount), assetAddress)}

        className="flex items-center space-x-1.5 text-xs font-bold text-pink-500"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img
          src={`${STATIC_ASSETS_URL}/brands/uniswap.png`}
          className="h-5 w-5"
          height={20}
          width={20}
          alt="Uniswap"
        />
        <div>Swap in Uniswap</div>
      </Link>
    </div>
  );
};

export default NoBalanceError;
