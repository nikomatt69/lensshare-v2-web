import parseJwt from '@lensshare/lib/parseJwt';
import type { NextApiRequest } from 'next';


import { GARDENER_FEATURE_ID } from '../constants';
import createSupabaseClient from '../createSupabaseClient';

/**
 * Middleware to validate if the user is gardener
 * @param request Incoming worker request
 * @returns Response
 */
const validateIsGardener = async (request: NextApiRequest) => {
  const accessToken = request.headers['x-access-token'] as string;

  if (!accessToken) {
    return false;
  }

  const payload = parseJwt(accessToken);
  const client = createSupabaseClient();

  const { data, error } = await client
    .from('profile-features')
    .select('profile_id, enabled')
    .eq('profile_id', payload.id)
    .eq('feature_id', GARDENER_FEATURE_ID)
    .eq('enabled', true)
    .single();

  if (error) {
    return false;
  }

  if (data.enabled) {
    return true;
  }

  return false;
};

export default validateIsGardener;
