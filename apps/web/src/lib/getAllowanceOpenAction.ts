import { VerifiedOpenActionModules } from '@lensshare/data/verified-openaction-modules';
import type { Address } from 'viem';



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
    case VerifiedOpenActionModules.Swap:
      return { name: 'Swap Open Action' };
    case VerifiedOpenActionModules.Tip:
      return { name: 'Tip Open Action' };
    case VerifiedOpenActionModules.Polymarket:
      return { name: 'Polymarket Open Action' };
    case VerifiedOpenActionModules.DecentNFT:
        return { name: 'Decent Open Action' };  
    default:
      return { name: 'Unknown Open Action' };
  }
};

export default getAllowanceOpenAction;
