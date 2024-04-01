import type { Handler } from 'express';

import logger from '@lensshare/lib/logger';
import catchedError from 'src/lib/catchedError';
import {
  SWR_CACHE_AGE_10_MINS_30_DAYS,
  VERIFIED_FEATURE_ID
} from 'src/lib/constants';
import prisma from 'src/lib/prisma';

export const get: Handler = async (_, res) => {
  try {
    const data = await prisma.profileFeature.findMany({
      select: { profileId: true },
      where: { enabled: true, featureId: VERIFIED_FEATURE_ID }
    });

    const ids = data.map((item: { profileId: number }) => item.profileId);
    logger.info('Verified profiles fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ result: ids, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
