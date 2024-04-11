import { Errors } from '@lensshare/data/errors';
import allowCors from '@utils/allowCors';
import createRedisClient from '@utils/createRedisClient';
import createSupabaseClient from '@utils/createSupabaseClient';
import validateIsStaff from '@utils/middlewares/validateIsStaff';
import type { NextApiRequest, NextApiResponse } from 'next';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  id: string;
  profile_id: string;
  enabled: boolean;
};

const validationSchema = object({
  id: string(),
  profile_id: string(),
  enabled: boolean()
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res.status(400).json({ success: false, error: Errors.SomethingWentWrong });
  }

  if (!(await validateIsStaff(req))) {
    return res.status(400).json({ success: false, error: Errors.SomethingWentWrong });
  }

  const { id, profile_id, enabled } = body as ExtensionRequest;

  try {
    const redis = createRedisClient();
    const client = createSupabaseClient();
    if (enabled) {
      const { error: upsertError } = await client
        .from('profile-features')
        .upsert({ feature_id: id, profile_id: profile_id })
        .select();

      if (upsertError) {
        throw upsertError;
      }

      // Delete the cache
      await redis.del(`features:${profile_id}`);

      return res.status(200).json({ success: true, enabled });
    }

    const { error: deleteError } = await client
      .from('profile-features')
      .delete()
      .eq('feature_id', id)
      .eq('profile_id', profile_id)
      .select();

    if (deleteError) {
      throw deleteError;
    }

    // Delete the cache
    await redis.del(`features:${profile_id}`);

    return res.status(200).json({ success: true, enabled });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
