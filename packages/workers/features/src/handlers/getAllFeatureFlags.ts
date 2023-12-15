import response from '@lensshare/lib/response';
import createSupabaseClient from '@lensshare/supabase/createSupabaseClient';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  try {
    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    const { data, error } = await client
      .from('features')
      .select('*')
      .order('priority', { ascending: false });

    if (error) {
      throw error;
    }

    return response({ success: true, features: data });
  } catch (error) {
    throw error;
  }
};
