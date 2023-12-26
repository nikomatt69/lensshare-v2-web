import type { Handler } from 'express';

import logger from '@lensshare/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import createClickhouseClient from '@utils/createClickhouseClient';
import { invalidBody, noBody } from '@utils/responses';
import { array, object, string } from 'zod';

type ExtensionRequest = {
  ids: string[];
};

const validationSchema = object({
  ids: array(string().max(2000, { message: 'Too many ids!' }))
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const { ids } = body as ExtensionRequest;

  try {
    const client = createClickhouseClient();
    const rows = await client.query({
      format: 'JSONEachRow',
      query: `
        SELECT publication_id, COUNT(*) AS count
        FROM impressions
        WHERE publication_id IN (${ids.map((id) => `'${id}'`).join(',')})
        GROUP BY publication_id;
      `
    });

    const result =
      await rows.json<Array<{ count: number; publication_id: string }>>();

    const viewCounts = result.map((row) => ({
      id: row.publication_id,
      views: Number(row.count)
    }));
    logger.info(`Fetched publication views for ${ids.length} publications`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({ success: true, views: viewCounts });
  } catch (error) {
    return catchedError(res, error);
  }
};
