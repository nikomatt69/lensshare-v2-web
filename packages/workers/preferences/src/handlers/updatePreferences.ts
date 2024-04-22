import { Errors } from '@lensshare/data/errors';
import response from '@lensshare/lib/response';
import createSupabaseClient from '@lensshare/supabase/createSupabaseClient';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { boolean, object, string } from 'zod';

import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  id?: string;
  isPride?: boolean;
  highSignalNotificationFilter?: boolean;
};

const validationSchema = object({
  id: string().optional(),
  isPride: boolean().optional(),
  highSignalNotificationFilter: boolean().optional()
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

  const { isPride, highSignalNotificationFilter } = body as ExtensionRequest;

  try {
    const { payload } = jwt.decode(accessToken as string);
    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    const { data, error } = await client
      .from('rights')
      .upsert({
        id: payload.id,
        is_pride: isPride,
        high_signal_notification_filter: highSignalNotificationFilter
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return response({ success: true, result: data });
  } catch (error) {
    throw error;
  }
};
