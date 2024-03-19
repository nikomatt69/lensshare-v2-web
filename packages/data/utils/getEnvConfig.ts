import { LENS_NETWORK } from '../constants';
import { MainnetContracts, TestnetContracts } from '../contracts';
import LensEndpoint from '../lens-endpoints';

const getEnvConfig = (): {
  publicActProxyAddress: `0x${string}`;
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
        publicActProxyAddress: MainnetContracts.PublicActProxy,
        heyLensSignup: TestnetContracts.HeyLensSignup,
        
      };
    default:
      return {
        apiEndpoint: LensEndpoint.Mainnet,
        lensHubProxyAddress: MainnetContracts.LensHubProxy,
        defaultCollectToken: MainnetContracts.DefaultToken,
        litProtocolEnvironment: 'polygon',
        publicActProxyAddress: MainnetContracts.PublicActProxy,
        heyLensSignup: TestnetContracts.HeyLensSignup,
      };
  }
};

export default getEnvConfig;
