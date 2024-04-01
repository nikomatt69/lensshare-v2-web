import type { Handler } from 'express';

import logger from '@lensshare/lib/logger';
import catchedError from 'src/lib/catchedError';
import validateIsStaff from 'src/lib/middlewares/validateIsStaff';
import prisma from 'src/lib/prisma';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  id: string;
};

const validationSchema = object({
  id: string()
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

  if (!(await validateIsStaff(req))) {
    return notAllowed(res);
  }

  const { id } = body as ExtensionRequest;

  try {
    await prisma.feature.delete({ where: { id } });
    logger.info(`Deleted a feature flag ${id}`);

    return res.status(200).json({ success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
