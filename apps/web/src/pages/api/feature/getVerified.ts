import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'src/utils/allowCors';
import { CACHE_AGE } from 'src/utils/constants';
import createSupabaseClient from 'src/utils/createSupabaseClient';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = createSupabaseClient();
    const { data, error } = await client.from('verified').select('*');

    if (error) {
      throw error;
    }

    const ids = data.map((item) => item.id);

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({ success: true, result: ids });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
