import { Errors } from '@lensshare/data/errors';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'src/utils//allowCors';
import { CACHE_AGE } from 'src/utils/constants';
import getMetadata from 'src/utils/oembed/getMetadata';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({
        success: true,
        oembed: await getMetadata(url as string)
      });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
