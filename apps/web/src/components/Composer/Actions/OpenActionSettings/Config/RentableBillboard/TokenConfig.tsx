import type { Address } from 'viem';


import { type FC } from 'react';

import { useRentableBillboardActionStore } from '.';
import { Select } from '@lensshare/ui';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';

const TokenConfig: FC = () => {
  const { currency, setCurrency } = useRentableBillboardActionStore();
  const { allowedTokens } = useAllowedTokensStore();

  return (
    <div className="mt-5">
      <div className="label">Select currency</div>
      <Select
        
        onChange={(event) => {
          const value = event.target.value as string; // Cast the value to string
          setCurrency(
            value as unknown as  Address,
            allowedTokens?.find((t) => t.symbol === value)?.decimals || 18
          );
        }}
        options={allowedTokens?.map((token) => ({
          icon: `${STATIC_ASSETS_URL}/images/tokens/${token.symbol}.svg`,
          label: token.name,
          selected: token.contractAddress === currency.token,
          value: token.contractAddress
        }))}
      />
    </div>
  );
};

export default TokenConfig;
