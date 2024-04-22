import logger from '@lensshare/lib/logger';

import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'src/utils/allowCors';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from 'src/utils/constants';
import prisma from 'src/utils/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await prisma.allowedToken.findMany({
      orderBy: { createdAt: 'desc' }
    });
    logger.info('All tokens fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({ success: true, tokens: data });
  } catch (error) {
    return error;
  }
};
export default allowCors(handler);
