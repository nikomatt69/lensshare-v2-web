import { LENS_NETWORK } from '../constants';
import { MainnetContracts, TestnetContracts } from '../contracts';
import LensEndpoint from '../lens-endpoints';

const getEnvConfig = (): {
  apiEndpoint: string;
  lensHubProxyAddress: `0x${string}`;
  defaultCollectToken: string;
  litProtocolEnvironment: string;
  heyLensSignup: `0x${string}`;
} => {
  switch (LENS_NETWORK) {
    case 'testnet':
      return {
        apiEndpoint: LensEndpoint.Mainnet,
        lensHubProxyAddress: MainnetContracts.LensHubProxy,
        defaultCollectToken: MainnetContracts.DefaultToken,
        litProtocolEnvironment: 'polygon',
        heyLensSignup: TestnetContracts.HeyLensSignup,
      };
    default:
      return {
        apiEndpoint: LensEndpoint.Mainnet,
        lensHubProxyAddress: MainnetContracts.LensHubProxy,
        defaultCollectToken: MainnetContracts.DefaultToken,
        litProtocolEnvironment: 'polygon',
        heyLensSignup: TestnetContracts.HeyLensSignup,
      };
  }
};

export default getEnvConfig;
