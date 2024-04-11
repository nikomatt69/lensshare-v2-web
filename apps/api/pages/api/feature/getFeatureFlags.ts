import { Errors } from '@lensshare/data/errors';
import allowCors from '@utils/allowCors';
import { CACHE_AGE } from '@utils/constants';
import createRedisClient from '@utils/createRedisClient';
import createSupabaseClient from '@utils/createSupabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const redis = createRedisClient();
    const cache = await redis.get(`features:${id}`);

    if (cache) {
      return res
        .status(200)
        .setHeader('Cache-Control', CACHE_AGE)
        .json({ success: true, cached: true, features: JSON.parse(cache) });
    }

    const client = createSupabaseClient();
    const { data, error } = await client
      .from('profile-features')
      .select('profile_id, enabled, features!inner(key, enabled)')
      .eq('features.enabled', true)
      .eq('profile_id', id)
      .eq('enabled', true);

    if (error) {
      throw error;
    }

    const features = data.map((feature: any) => feature.features?.key);
    await redis.set(`features:${id}`, JSON.stringify(features));

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({ success: true, features });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
