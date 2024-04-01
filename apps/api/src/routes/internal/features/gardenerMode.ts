import type { Handler } from 'express';

import logger from '@lensshare/lib/logger';
import parseJwt from '@lensshare/lib/parseJwt';
import catchedError from 'src/lib/catchedError';
import { GARDENER_MODE_FEATURE_ID } from 'src/lib/constants';
import validateIsGardener from 'src/lib/middlewares/validateIsGardener';
import prisma from 'src/lib/prisma';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { boolean, object } from 'zod';

type ExtensionRequest = {
  enabled: boolean;
};

const validationSchema = object({
  enabled: boolean()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  if (!(await validateIsGardener(req))) {
    return notAllowed(res);
  }

  const { enabled } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);
    const profile_id = payload.id;

    if (enabled) {
      await prisma.profileFeature.create({
        data: { featureId: GARDENER_MODE_FEATURE_ID, profileId: profile_id }
      });
      logger.info(`Enabled gardener mode for ${profile_id}`);

      return res.status(200).json({ enabled, success: true });
    }

    await prisma.profileFeature.delete({
      where: {
        profileId_featureId: {
          featureId: GARDENER_MODE_FEATURE_ID,
          profileId: profile_id
        }
      }
    });
    logger.info(`Disabled gardener mode for ${profile_id}`);

    return res.status(200).json({ enabled, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
