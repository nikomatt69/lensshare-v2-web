import parseJwt from '@lensshare/lib/parseJwt';
import { hydrateAuthTokens } from 'src/store/persisted/useAuthStore';


const getCurrentSessionProfileId = (): string => {
  const { accessToken } = hydrateAuthTokens();

  const currentSession = parseJwt(accessToken || '');
  return currentSession?.id;
};

export default getCurrentSessionProfileId;
