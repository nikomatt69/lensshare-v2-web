import type { Handler } from 'express';

import { Errors } from '@lensshare/data/errors';
import logger from '@lensshare/lib/logger';
import catchedError from '@utils/catchedError';
import prisma from '@utils/prisma';
import { invalidBody, noBody } from '@utils/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  secret: string;
};

const validationSchema = object({
  secret: string()
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

  const { secret } = body as ExtensionRequest;

  if (secret !== process.env.SECRET) {
    return res
      .status(400)
      .json({ error: Errors.SomethingWentWrong, success: false });
  }

  try {
    await prisma.pro.deleteMany({
      where: { expiresAt: { lte: new Date().toISOString() } }
    });
    logger.info('Downgraded expired pro profiles');

    return res.status(200).json({ success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
