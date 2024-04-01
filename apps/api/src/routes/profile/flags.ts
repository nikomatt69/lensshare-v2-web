import type { ProfileFlags } from '@lensshare/types/hey';
import type { Handler } from 'express';

import logger from '@lensshare/lib/logger';
import catchedError from 'src/lib/catchedError';
import {
  SUSPENDED_FEATURE_ID,
  SWR_CACHE_AGE_10_MINS_30_DAYS
} from 'src/lib/constants';
import prisma from 'src/lib/prisma';
import { noBody } from 'src/lib/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const profileFeature = await prisma.profileFeature.findFirst({
      select: { feature: { select: { id: true } } },
      where: {
        enabled: true,
        featureId: SUSPENDED_FEATURE_ID,
        profileId: id as string
      }
    });

    const response: ProfileFlags = {
      isSuspended: profileFeature?.feature.id === SUSPENDED_FEATURE_ID
    };

    logger.info('Profile flags fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ result: response, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
