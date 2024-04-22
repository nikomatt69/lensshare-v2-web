import response from '@lensshare/lib/response';
import createSupabaseClient from '@lensshare/supabase/createSupabaseClient';
import jwt from '@tsndr/cloudflare-worker-jwt';

import { GARDENER_FEATURE_ID } from '../constants';
import type { WorkerRequest } from '../types';

/**
 * Middleware to validate if the user is gardener
 * @param request Incoming worker request
 * @returns Response
 */
const validateIsGardener = async (request: WorkerRequest) => {
  const accessToken = request.headers.get('X-Access-Token');

  if (!accessToken) {
    return response({ success: false, error: 'No proper headers provided!' });
  }

  const { payload } = jwt.decode(accessToken);
  const client = createSupabaseClient(request.env.SUPABASE_KEY);

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
