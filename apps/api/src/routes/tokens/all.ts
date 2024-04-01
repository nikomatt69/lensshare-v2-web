import type { Handler } from 'express';

import logger from '@lensshare/lib/logger';
import catchedError from 'src/lib/catchedError';
import { SWR_CACHE_AGE_1_SEC_30_DAYS } from 'src/lib/constants';
import prisma from 'src/lib/prisma';

export const get: Handler = async (_, res) => {
  try {
    const data = await prisma.allowedToken.findMany({
      orderBy: { priority: 'desc' }
    });
    logger.info('All tokens fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_SEC_30_DAYS)
      .json({ success: true, tokens: data });
  } catch (error) {
    return catchedError(res, error);
  }
};
