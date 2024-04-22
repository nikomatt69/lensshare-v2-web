import parseJwt from '@lensshare/lib/parseJwt';
import { hydrateAuthTokens } from 'src/store/persisted/useAuthStore';


const getCurrentSessionId = (): string => {
  const { accessToken } = hydrateAuthTokens();

  const currentSession = parseJwt(accessToken || '');
  return currentSession?.authorizationId;
};

export default getCurrentSessionId;
