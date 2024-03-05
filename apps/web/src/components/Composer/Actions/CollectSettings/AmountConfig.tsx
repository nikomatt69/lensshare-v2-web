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
  const collectModule = useCollectModuleStore((state) => state.collectModule);

  return (
    <div className="pt-3">
      <ToggleWithHelper
        on={Boolean(collectModule.amount?.value)}
        setOn={() => {
          setCollectType({
            type: collectModule.amount?.value
              ? OpenActionModuleType.SimpleCollectOpenActionModule
              : collectModule.recipients?.length
              ? OpenActionModuleType.MultirecipientFeeCollectOpenActionModule
              : OpenActionModuleType.SimpleCollectOpenActionModule,
            amount: collectModule.amount?.value
              ? null
              : { currency: DEFAULT_COLLECT_TOKEN, value: '1' }
          });
        }}
        heading="Charge for collecting"
        description="Get paid whenever someone collects your post"
        icon={<CurrencyDollarIcon className="h-4 w-4" />}
      />
      {collectModule.amount?.value ? (
        <div className="pt-4">
          <div className="flex space-x-2 text-sm">
            <Input
              label="Price"
              type="number"
              placeholder="0.5"
              min="0"
              max="100000"
              value={parseFloat(collectModule.amount.value)}
              onChange={(event) => {
                setCollectType({
                  amount: {
                    currency: collectModule.amount?.currency,
                    value: event.target.value ? event.target.value : '0'
                  }
                });
              }}
            />
            <div>
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
                  value: token.contractAddress
                }))}
              />
            </div>
          </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AmountConfig;
