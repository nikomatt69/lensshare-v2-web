import { Errors } from '@lensshare/data/errors';
import allowCors from '@utils/allowCors';
import { CACHE_AGE } from '@utils/constants';
import createClickhouseClient from '@utils/createClickhouseClient';
import type { NextApiRequest, NextApiResponse } from 'next';
import { array, object, string } from 'zod';

type ExtensionRequest = {
  ids: string[];
};

const validationSchema = object({
  ids: array(string().max(2000, { message: 'Too many ids!' }))
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res
      .status(400)
      .json({ success: false, error: Errors.SomethingWentWrong });
  }

  const { ids } = body as ExtensionRequest;

  try {
    const client = createClickhouseClient();
    const rows = await client.query({
      query: `
        SELECT publication_id, COUNT(*) AS count
        FROM impressions
        WHERE publication_id IN (${ids.map((id) => `'${id}'`).join(',')})
        GROUP BY publication_id;
      `,
      format: 'JSONEachRow'
    });

    const result =
      await rows.json<Array<{ publication_id: string; count: number }>>();

    const viewCounts = result.map((row) => ({
      id: row.publication_id,
      views: Number(row.count)
    }));

    return res
      .status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .json({ success: true, views: viewCounts });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
