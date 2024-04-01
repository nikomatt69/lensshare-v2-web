import type { Request } from 'express';

import parseJwt from '@lensshare/lib/parseJwt';
import prisma from 'src/lib/prisma';

import { GARDENER_FEATURE_ID } from '../constants';
import validateLensAccount from './validateLensAccount';

/**
 * Middleware to validate if the profile is gardener
 * @param request Incoming request
 * @returns Response
 */
const validateIsGardener = async (request: Request) => {
  if (!(await validateLensAccount(request))) {
    return false;
  }

  try {
    const accessToken = request.headers['x-access-token'] as string;

    if (!accessToken) {
      return false;
    }

    const payload = parseJwt(accessToken);
    const data = await prisma.profileFeature.findFirst({
      where: {
        enabled: true,
        featureId: GARDENER_FEATURE_ID,
        profileId: payload.id
      }
    });

    if (data?.enabled) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

export default validateIsGardener;
