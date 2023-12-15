import type { PaymentDetails } from '@superfluid-finance/widget';

import paymentOptions from './paymentOptions';

const paymentDetails: PaymentDetails = {
  paymentOptions,
  modifyFlowRateBehaviour: 'ADD',
  defaultWrapAmount: {
    multiplier: 0,
    period: undefined
  }
};

export default paymentDetails;
