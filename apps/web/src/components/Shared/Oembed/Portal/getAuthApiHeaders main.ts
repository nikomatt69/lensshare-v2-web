import { IS_MAINNET } from '@lensshare/data/constants';
import { hydrateAuthTokens } from 'src/store/persisted/useAuthStore';

/**
 * Get auth api headers
 * @returns Auth api headers
 */
const getAuthApiHeaders = () => {
  return {
    'X-Access-Token': hydrateAuthTokens().accessToken,
    'X-Lens-Network': IS_MAINNET ? 'mainnet' : 'mainnet'
  };
};

export default getAuthApiHeaders;
