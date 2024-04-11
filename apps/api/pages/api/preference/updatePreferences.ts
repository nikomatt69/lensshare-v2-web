import { Errors } from '@lensshare/data/errors';
import parseJwt from '@lensshare/lib/parseJwt';
import allowCors from '@utils/allowCors';
import createRedisClient from '@utils/createRedisClient';
import createSupabaseClient from '@utils/createSupabaseClient';
import validateLensAccount from '@utils/middlewares/validateLensAccount';
import type { NextApiRequest, NextApiResponse } from 'next';
import { boolean, object, string } from 'zod';

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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res.status(400).json({ success: false, error: Errors.SomethingWentWrong });
  }

  if (!(await validateLensAccount(req))) {
    return res
      .status(400)
      .json({ success: false, error: Errors.InvalidAccesstoken });
  }

  const { isPride, highSignalNotificationFilter } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);
    const redis = createRedisClient();
    const client = createSupabaseClient();
    const { data, error } = await client
      .from('preferences')
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

    // Delete the cache
    await redis.del(`preferences:${payload.id}`);

    return res.status(200).json({ success: true, result: data });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
