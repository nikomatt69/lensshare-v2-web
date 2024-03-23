import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { DEFAULT_COLLECT_TOKEN } from '@lensshare/data/constants';
import {
  FollowModuleType,
  LimitType,
  useApprovedModuleAllowanceAmountQuery
} from '@lensshare/lens';

import { ErrorMessage, Select } from '@lensshare/ui';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Allowance from './Allowance';
import allowedOpenActionModules from '@lib/allowedOpen (1)';
import { AllowedToken } from '@lensshare/types/hey';
import { useEnabledCurrenciesQuery } from '@lensshare/lens/generated5';
import { useAppStore } from 'src/store/useAppStore';

const getAllowancePayload = (currency: string) => {
  return {
    currencies: [currency],
    followModules: [FollowModuleType.FeeFollowModule],
    openActionModules: allowedOpenActionModules
  };
};

const CollectModules: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<AllowedToken | null>(
    null
  );
  const { data: allowedTokens, loading: loadingAllowedTokens } =
    useEnabledCurrenciesQuery({
      variables: { request: { limit: LimitType.TwentyFive } }
  });

  const { data, error, loading, refetch } =
    useApprovedModuleAllowanceAmountQuery({
      fetchPolicy: 'no-cache',
      skip: !currentProfile?.id || loadingAllowedTokens,
      variables: { request: getAllowancePayload(DEFAULT_COLLECT_TOKEN) }
  });

  if (error ) {
    return (
      <ErrorMessage
        className="mt-5"
        error={(error ) as Error}
        title="Failed to load data"
      />
    );
  }

  return (
    <div className="mt-5">
        <div className="space-y-3">
          <div className="text-lg font-bold">
            Allow / revoke follow or collect modules
          </div>
          <p>
            In order to use collect feature you need to allow the module you
            use, you can allow and revoke the module anytime.
          </p>
        </div>
        <div className="divider my-5" />
        <div className="label mt-6">Select currency</div>
        <Select
            defaultValue={DEFAULT_COLLECT_TOKEN}
            onChange={(e) => {
              const selectedToken = allowedTokens?.currencies.items.find(
                (currencies) => currencies?.contract.address === e.target.value
              );
              if (selectedToken) {
                setSelectedCurrency(
                  allowedTokens?.currencies.items.find(
                    (currencies) =>
                      currencies?.contract.address === e.target.value
                  ) as unknown as AllowedToken
                );
              }}}
              options={allowedTokens?.currencies.items.map((token) => ({
                label: token.name,
                value: token.contract.address
              }))}
            />
      {loading ||  currencyLoading ? (
        <div className="py-5">
          <Loader />
        </div>
      ) : (
        <Allowance allowance={data} />
      )}
    </div>
  );
};

export default CollectModules;