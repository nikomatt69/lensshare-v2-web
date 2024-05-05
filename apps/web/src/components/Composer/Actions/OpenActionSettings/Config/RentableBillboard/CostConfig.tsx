
import { type FC, useRef } from 'react';


import { useRentableBillboardActionStore } from '.';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';
import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import { Input } from '@lensshare/ui';
import usePreventScrollOnNumberInput from './usePreventScrollOnNumberInput';

const CostConfig: FC = () => {
  const { costPerSecond, currency, setCostPerSecond } =
    useRentableBillboardActionStore();
  const { allowedTokens } = useAllowedTokensStore();
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef);

  return (
    <div className="mt-5">
      <Input
        className="no-spinner"
        iconRight={
          <img
            src={`${STATIC_ASSETS_URL}/images/tokens/${
              allowedTokens?.find((t) => t.contractAddress === currency.token)
                ?.symbol
            }.svg`}
          />
        }
        inputMode="numeric"
        label="Cost per second"
        onChange={(e) => {
          setCostPerSecond(e.target.value as unknown as number);
        }}
        placeholder="0.5"
        ref={inputRef}
        type="number"
        value={costPerSecond}
      />
    </div>
  );
};

export default CostConfig;
