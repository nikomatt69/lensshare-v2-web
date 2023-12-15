import tokenList from '@superfluid-finance/tokenlist';
import SuperfluidWidget from '@superfluid-finance/widget';
import * as React from 'react';

import paymentDetails from './paymentDetails';
import type { Profile } from '@lensshare/lens';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface SuperfluidSubscribeProps {
  profile: Profile;
}

export function SuperfluidSubscribe({ profile }: SuperfluidSubscribeProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const walletManager = {
    open: async () => setIsOpen(true),
    isOpen: isOpen
  };

  const customPaymentDetails = paymentDetails.paymentOptions.map((option) => {
    return {
      ...option,
      receiverAddress: profile.ownedBy.address
    };
  });

  return (
    <div>
      <SuperfluidWidget
        productDetails={{
          name: 'Superfluid Subscription | ' + profile.handle?.localName,
          description:
            profile.metadata?.bio ||
            "Subscribe to this creator's Superfluid stream"
        }}
        paymentDetails={{
          paymentOptions: customPaymentDetails
        }}
        tokenList={tokenList}
        type="dialog"
        walletManager={walletManager}
      >
        {({ openModal }) => (
          <button
            type="button"
            onClick={() => openModal()}
            className=" text-brand-500 text-md  px-2 py-3"
          >
            <CurrencyDollarIcon className="h-6 w-6 sm:h-6 sm:w-6"/>
          </button>
          // <Button
          //   className="!px-3 !py-1 text-sm"
          //   outline
          //   onClick={() => openModal()}
          //   variant="super"
          //   aria-label="Subscribe"
          //   icon={<UserRemoveIcon className="w-4 h-4" />}
          // >
          //   {t`Subscribe`}
          // </Button>
        )}
      </SuperfluidWidget>
    </div>
  );
}

export default SuperfluidSubscribe;
