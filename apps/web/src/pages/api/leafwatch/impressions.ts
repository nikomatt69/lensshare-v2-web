import { Errors } from '@lensshare/data/errors';
import logger from '@lensshare/lib/logger';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'src/utils/allowCors';
import { CACHE_AGE_30_DAYS } from 'src/utils/constants';
import createClickhouseClient from 'src/utils/createClickhouseClient';
import urlcat from 'urlcat';
import requestIp from 'request-ip';
import { array, object, string } from 'zod';

type ExtensionRequest = {
  viewer_id: string;
  ids: string[];
};

const validationSchema = object({
  viewer_id: string(),
  ids: array(string())
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }
  const ip = requestIp.getClientIp(req);
  const { viewer_id, ids } = body as ExtensionRequest;

  try {
    let ipData: {
      city: string;
      country: string;
      regionName: string;
    } | null = null;

    try {
      const ipResponse = await fetch(
        urlcat('https://pro.ip-api.com/json/:ip', {
          ip,
          key: 'ace541d28b5da0b13d53049b165a60aa'
        })
      );
      ipData = await ipResponse.json();
    } catch (error) {
      return ( error);
    }

    const values = ids.map((id) => ({
      city: ipData?.city || null,
      country: ipData?.country || null,
      ip: ip || null,
      publication_id: id,
      region: ipData?.regionName || null,
      viewer_id
    }));

    const client = createClickhouseClient();
    const result = await client.insert({
      format: 'JSONEachRow',
      table: 'impressions',
      values
    });
    logger.info('Ingested impressions to Leafwatch');

    return res
      .status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .json({ success: true, id: result.query_id });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
