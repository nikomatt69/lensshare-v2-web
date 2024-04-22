import { Errors } from '@lensshare/data/errors';
import response from '@lensshare/lib/response';
import createSupabaseClient from '@lensshare/supabase/createSupabaseClient';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { boolean, object } from 'zod';

import { STAFF_MODE_FEATURE_ID } from '../constants';
import validateIsStaff from '../helpers/validateIsStaff';
import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  enabled: boolean;
};

const validationSchema = object({
  enabled: boolean()
});

export default async (request: WorkerRequest) => {
  const body = await request.json();
  if (!body) {
    return response({ success: false, error: Errors.NoBody });
  }

  const accessToken = request.headers.get('X-Access-Token');
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return response({ success: false, error: validation.error.issues });
  }

  if (!(await validateIsStaff(request))) {
    return response({ success: false, error: Errors.SomethingWentWrong });
  }

  const { enabled } = body as ExtensionRequest;

  try {
    const { payload } = jwt.decode(accessToken as string);
    const profile_id = payload.id;
    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    if (enabled) {
      const { error: upsertError } = await client
        .from('profile-features')
        .upsert({ feature_id: STAFF_MODE_FEATURE_ID, profile_id });

      if (upsertError) {
        throw upsertError;
      }

      return response({ success: true, enabled });
    }

    const { error: deleteError } = await client
      .from('profile-features')
      .delete()
      .eq('feature_id', STAFF_MODE_FEATURE_ID)
      .eq('profile_id', profile_id);

    if (deleteError) {
      throw deleteError;
    }

    return response({ success: true, enabled });
  } catch (error) {
    throw error;
  }
};
