import type {
  Erc20,
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@lensshare/lens';
import type { AllowedToken } from '@lensshare/types/hey';
import type { Address } from 'viem';

import Loader from '@components/Shared/Loader';
import { DEFAULT_COLLECT_TOKEN } from '@lensshare/data/constants';

import getAllTokens from '@lib/api/getAllTokens';
import getAssetSymbol from '@lensshare/lib/getAssetSymbol';
import getRedstonePrice from '@lib/getRedstonePrice';
import { RangeSlider, Select } from '@lensshare/ui';
import { useQuery } from '@tanstack/react-query';
import { type FC, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';
import { encodeAbiParameters, formatUnits, parseUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';

import TipAction from './TipAction';
import { TipIcon } from './TipIcon';
import { CHAIN } from '@lib/costantChain';
import { LimitType, useModuleMetadataQuery } from '@lensshare/lens';
import { USD_ENABLED_TOKEN_SYMBOLS } from './tokens symbols';
import { useEnabledCurrenciesQuery } from '@lensshare/lens/generated5';

interface TipOpenActionModuleProps {
  module: UnknownOpenActionModuleSettings;
  publication: MirrorablePublication;
}

const TipOpenActionModule: FC<TipOpenActionModuleProps> = ({
  module,
  publication
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<AllowedToken | null>(
    null
  );
  const [usdPrice, setUsdPrice] = useState(0);
  const [tip, setTip] = useState({
    currency: DEFAULT_COLLECT_TOKEN,
    value: [5]
  });

  const { address } = useAccount();

  const getUsdPrice = async () => {
    const usdPrice = await getRedstonePrice(
      getAssetSymbol(selectedCurrency?.symbol as string)
    );
    setUsdPrice(usdPrice);
  };

  useEffect(() => {
    getUsdPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency]);

  const { data: balanceData } = useBalance({
    address,
    token: selectedCurrency?.contractAddress as Address
  });

  const { data, loading } = useModuleMetadataQuery({
    skip: !Boolean(module?.contract.address),
    variables: { request: { implementation: module?.contract.address } }
  });

  const metadata = data?.moduleMetadata?.metadata;
  const balance = balanceData
    ? parseFloat(
        formatUnits(balanceData.value, selectedCurrency?.decimals as number)
      ).toFixed(selectedCurrency?.symbol === 'WETH' ? 4 : 2)
    : 0;
  const usdEnabled = USD_ENABLED_TOKEN_SYMBOLS.includes(
    selectedCurrency?.symbol as string
  );

  const { actOnUnknownOpenAction, isLoading } = useActOnUnknownOpenAction({
    signlessApproved: true,
    successToast: "You've sent a tip!"
  });

  

  const {
    data: allowedTokens,
    loading: loadingAllowedTokens,
    error
  } = useEnabledCurrenciesQuery({
    variables: { request: { limit: LimitType.TwentyFive } }
  });

  if (loading || loadingAllowedTokens) {
    return (
      <div className="m-5">
        <Loader message="Loading tip..." />
      </div>
    );
  }

  const act = async () => {
    if (usdEnabled && usdPrice === 0) {
      return toast.error('Failed to get USD price');
    }

    const abi = JSON.parse(metadata?.processCalldataABI);
    const currency = allowedTokens?.currencies.items.find(
      (currencies) => currencies?.contract.address === tip.currency
    );

    if (!currency) {
      return toast.error('Currency not supported');
    }

    const amount = tip.value[0];
    const usdValue = usdEnabled ? amount / usdPrice : amount;

    const calldata = encodeAbiParameters(abi, [
      currency.contract.address,
      parseUnits(usdValue.toString(), currency.decimals).toString()
    ]);

    return await actOnUnknownOpenAction({
      address: module.contract.address,
      data: calldata,
      publicationId: publication.id
    });
  };

  return (
    <div className="space-y-3 p-5">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="space-x-1 text-2xl">
            {usdEnabled ? (
              <>
                <span>$</span>
                <b>{tip.value[0]}</b>
              </>
            ) : (
              <>
                <b>{tip.value[0]}</b>
                <b>{selectedCurrency?.symbol}</b>
              </>
            )}
          </span>

          <div className="ld-text-gray-500 text-sm">
            {usdEnabled ? (
              <>
                {(tip.value[0] / usdPrice).toFixed(
                  selectedCurrency?.symbol === 'WETH' ? 4 : 2
                )}{' '}
                {selectedCurrency?.symbol}
              </>
            ) : (
              <>
                {tip.value[0]} {selectedCurrency?.symbol}
              </>
            )}
          </div>
        </div>
        <div className="flex w-5/12 flex-col items-end space-y-1">
          <Select
            defaultValue={DEFAULT_COLLECT_TOKEN}
            onChange={(e) => {
              setTip({ ...tip, currency: e.target.value });
              setSelectedCurrency(
                allowedTokens?.currencies.items.find(
                  (currencies) => currencies?.contract.address === e.target.value
                ) as unknown as AllowedToken
              );
            }}
            options={allowedTokens?.currencies.items.map((token) => ({
              label: token.name,
              value: token.contract.address
            }))}
          />
          <div className="ld-text-gray-500 text-sm">Balance: {balance}</div>
        </div>
      </div>
      <div className="pb-3 pt-5">
        <RangeSlider
          min={1}
          onValueChange={(value) => setTip({ ...tip, value })}
          value={tip.value}
        />
      </div>
      {selectedCurrency ? (
        <TipAction
          act={act}
          className="mt-5 w-full justify-center"
          icon={<TipIcon className="h-4 w-4" />}
          isLoading={isLoading}
          module={module}
          moduleAmount={{
            asset: {
              contract: {
                address: selectedCurrency.contractAddress,
                chainId: CHAIN.id
              },
              decimals: selectedCurrency.decimals,
              name: selectedCurrency.name,
              symbol: selectedCurrency.symbol
            },
            value: tip.value[0].toString()
          }}
          title="Send Tip"
        />
      ) : null}
    </div>
  );
};

export default TipOpenActionModule;
