import { Errors } from '@lensshare/data/errors';
import response from '@lensshare/lib/response';
import createSupabaseClient from '@lensshare/supabase/createSupabaseClient';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const id = request.query.id as string;

  if (!id) {
    return response({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    const { data } = await client
      .from('membership-nft')
      .select('*')
      .eq('id', id)
      .single();

    return response({ success: true, result: data });
  } catch (error) {
    throw error;
  }
};
