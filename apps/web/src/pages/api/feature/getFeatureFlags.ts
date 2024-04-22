import { Errors } from '@lensshare/data/errors';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'src/utils/allowCors';
import { CACHE_AGE } from 'src/utils/constants';
import createSupabaseClient from 'src/utils/createSupabaseClient';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
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

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({ success: true, features });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
