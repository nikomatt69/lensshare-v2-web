import { Errors } from '@lensshare/data/errors';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'src/utils/allowCors';
import { CACHE_AGE } from 'src/utils/constants';
import createClickhouseClient from 'src/utils/createClickhouseClient';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createClickhouseClient();
    const rows = await client.query({
      query: `SELECT count(*) as count FROM events WHERE actor = '${id}';`,
      format: 'JSONEachRow'
    });
    const result = await rows.json<Array<{ count: number }>>();

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({ success: true, haveUsedHey: Number(result[0].count) > 0 });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
