import { Errors } from '@lensshare/data/errors';
import logger from '@lensshare/lib/logger';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'src/utils//allowCors';
import { CACHE_AGE, CACHE_AGE_30_DAYS } from 'src/utils/constants';
import getMetadata from 'src/utils/oembed/getMetadata';
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    logger.info(`Oembed generated for ${url}`);
    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_30_DAYS)
      .json({
        oembed: await getMetadata(url as string),
        success: true
      });
  } catch (error) {
    logger.error(Errors.NoBody);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default allowCors(handler);
