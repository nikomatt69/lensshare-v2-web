import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { DEFAULT_COLLECT_TOKEN } from '@lensshare/data/constants';
import type { Erc20 } from '@lensshare/lens';
import { OpenActionModuleType } from '@lensshare/lens';
import { AllowedToken } from '@lensshare/types/hey';
import { Input, Select } from '@lensshare/ui';
import type { FC } from 'react';
import { useCollectModuleStore } from 'src/store/useCollectModuleStore';

interface AmountConfigProps {
  allowedTokens?: AllowedToken[];
  setCollectType: (data: any) => void;
}

const AmountConfig: FC<AmountConfigProps> = ({
  allowedTokens,
  setCollectType
}) => {
  const { collectModule } = useCollectModuleStore((state) => state);

  return (
    <div>
      <ToggleWithHelper
        description="Get paid whenever someone collects your post"
        heading="Charge for collecting"
        icon={<CurrencyDollarIcon className="h-5 w-5" />}
        on={Boolean(collectModule.amount?.value)}
        setOn={() => {
          setCollectType({
            amount: collectModule.amount?.value
              ? null
              : { currency: DEFAULT_COLLECT_TOKEN, value: '1' },
            type: collectModule.amount?.value
              ? OpenActionModuleType.SimpleCollectOpenActionModule
              : collectModule.recipients?.length
                ? OpenActionModuleType.MultirecipientFeeCollectOpenActionModule
                : OpenActionModuleType.SimpleCollectOpenActionModule
          });
        }}
      />
      {collectModule.amount?.value ? (
        <div className="ml-8 mt-4">
          <div className="flex space-x-2 text-sm">
            <Input
              label="Price"
              max="100000"
              min="0"
              onChange={(event) => {
                setCollectType({
                  amount: {
                    currency: collectModule.amount?.currency,
                    value: event.target.value ? event.target.value : '0'
                  }
                });
              }}
              placeholder="0.5"
              type="number"
              value={parseFloat(collectModule.amount.value)}
            />
            <div className="w-5/6">
              <div className="label">Select currency</div>
              <Select
                onChange={(e) => {
                  setCollectType({
                    amount: {
                      currency: e.target.value,
                      value: collectModule.amount?.value
                    }
                  });
                }}
                options={allowedTokens?.map((token) => ({
                  label: token.name,
                  selected:
                    token.contractAddress === collectModule.amount?.currency,
                  value: token.contractAddress
                }))}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AmountConfig;