import StreamOutline from '@components/Icons/StreamOutline';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import type { Profile } from '@lensshare/lens/generated';
import { superfluidClient } from '@lensshare/lens/apollo';
import { Card, ErrorMessage } from '@lensshare/ui';
import { EmptyState } from '@lensshare/ui/src/EmptyState';
import { SuperfluidInflowsDocument } from '@lensshare/lens/generated3';
import { type FC, useEffect, useState } from 'react';

export interface Sender {
  id: string;
}
export interface UnderlyingToken {
  name: string;
  symbol: string;
}
export interface Token {
  name: string;
  symbol: string;
  decimals: string;
  id: string;
  underlyingToken: UnderlyingToken;
}

export interface Inflow {
  id: string;
  sender: Sender;
  token: Token;
  deposit: string;
  currentFlowRate: string;
  createdAtTimestamp: string;
}

interface SubscribersFeedProps {
  profile: Profile;
}

export interface Account {
  createdAtTimestamp: string;
  createdAtBlockNumber: string;
  isSuperApp: boolean;
  updatedAtBlockNumber: string;
  updatedAtTimestamp: string;
  inflows: Inflow[];
}
export interface SuplerfluidInflowsDataType {
  account: Account;
}

const SubscribersFeed: FC<SubscribersFeedProps> = ({ profile }) => {
  const [currentAddress, setCurrentAddress] = useState('');
  const [superfluidInflowsData, setSuperfluidInflowsData] =
    useState<SuplerfluidInflowsDataType>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  console.log('profile.ownedBy.address', profile.ownedBy.address);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } =
        await superfluidClient.query<SuplerfluidInflowsDataType>({
          query: SuperfluidInflowsDocument,
          variables: { id: profile?.ownedBy.address.toLowerCase() }
        });
      setCurrentAddress(profile?.ownedBy.address);
      setSuperfluidInflowsData(data);
      setLoading(false);
      setError(error);
    };

    fetchData();
  }, [profile]);

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (superfluidInflowsData?.account === null) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">
              @{profile?.handle?.localName}
            </span>
            <span>{'has nothing in their subscribers feed yet!'}</span>
          </div>
        }
        icon={<StreamOutline className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title={`Failed to load profile subscribers feed`}
        error={error}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {superfluidInflowsData?.account.inflows
        .filter((inflow) => parseFloat(inflow.currentFlowRate) > 0)
        .sort((a, b) => {
          return parseFloat(b.currentFlowRate) - parseFloat(a.currentFlowRate);
        })
        .map((inflow) => {
          const imageURL = `https://nft.superfluid.finance/cfa/v1/getsvg?chain_id=137&token_address=${inflow.token.id}&token_symbol=${inflow.token.symbol}&sender=${inflow.sender.id}&receiver=${currentAddress}&flowRate=${inflow.currentFlowRate}&start_date=${inflow.createdAtTimestamp}`;

          return (
            <Card
              className="bg-brand-300 divide-y-[1px] p-4 dark:divide-gray-700"
              key={'profile-subscribers-card-' + inflow.id}
            >
              <a
                href={`https://polygonscan.com/address/${inflow.sender.id}`}
                target="_blank"
                className="cursor-pointer underline"
                rel="noopener noreferrer"
              >
                <img src={imageURL} />
              </a>
            </Card>
          );
        })}
    </div>
  );
};

export default SubscribersFeed;
