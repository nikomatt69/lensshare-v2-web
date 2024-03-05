import type { Address } from 'viem';

import { VerifiedOpenActionModules } from '@lensshare/data/verified-openaction-modules';

/**
 * Returns the name of the specified open action module.
 *
 * @param address Address of the module.
 * @returns Object containing the name of the module.
 */
const getAllowanceOpenAction = (
  address: Address
): {
  name: string;
} => {
  switch (address) {
    case VerifiedOpenActionModules.Tip:
      return { name: 'Tip Open Action' };

    case VerifiedOpenActionModules.DecentNFT:
      return { name: 'NFT Mint Open Action' };

    default:
      return { name: 'Unknown Open Action' };
  }
};

export default getAllowanceOpenAction;
