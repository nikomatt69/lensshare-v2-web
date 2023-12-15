import { IS_MAINNET } from '@lensshare/data/constants';
import { hydrateAuthTokens } from 'src/store/useAuthPersistStore';

const getAuthWorkerHeaders = () => {
  return {
    'X-Access-Token': hydrateAuthTokens().accessToken,
    'X-Lens-Network': IS_MAINNET ? 'mainnet' : 'mainnet'
  };
};

export default getAuthWorkerHeaders;
