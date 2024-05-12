import { isAddress, type Address } from 'viem';


import { Input, Select } from '@lensshare/ui';
import { type FC } from 'react';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';

import { useRentableBillboardActionStore } from '.';
import { CHAIN_ID, STATIC_ASSETS_URL } from '@lensshare/data/constants';
import useTokenMetadata from 'src/hooks/alchemy/useTokenMetadata';

const TokenConfig: FC = () => {
  const { currency, setCurrency } = useRentableBillboardActionStore();
  const { data } = useTokenMetadata({
    address: currency.token,
    chain: CHAIN_ID,
    enabled: currency.token !== undefined && isAddress(currency.token)
  });

  return (
    <div className="text-sm">
      <Input
        error={!isAddress(currency.token)}
        label="Token address (Polygon)"
        min="1"
        onChange={(event: { target: { value: string; }; }) => {
          setCurrency(event.target.value as Address , data?.decimals || 18);
        }}
        placeholder="0x..."
        value={currency.token}
      />
      {data ? (
        <div className="mt-1 font-bold text-green-500">
          {data.name} ({data.symbol})
        </div>
      ) : null}
    </div>
  );
};

export default TokenConfig;
