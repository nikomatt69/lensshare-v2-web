import type { NextApiRequest, NextApiResponse } from 'next';

import logger from '@lensshare/lib/logger';
import { array, number, object, string } from 'zod';
import validateLensAccount from 'src/utils/middlewares/validateLensAccount'; // You may need to adjust this import
import prisma from 'src/utils/prisma';
import { Errors } from '@lensshare/data/errors';

type ExtensionRequest = {
  length: number;
  options: string[];
};

const validationSchema = object({
  length: number(),
  options: array(string())
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: 'Method not allowed', success: false });
  }

  const { body } = req;

  if (!body) {
    return res.status(400).json({ error: 'No body provided', success: false });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res.status(400).json({ error: 'Validation failed', success: false });
  }

  // Assuming validateLensAccount is an async function that returns a boolean
  if (!(await validateLensAccount(req))) {
    return res
      .status(403)
      .json({ error: 'Invalid Lens account', success: false });
  }

  const { length, options } = body as ExtensionRequest;

  if (length < 1 || length > 30) {
    return res.status(400).json({
      error: 'Poll length should be between 1 and 30 days.',
      success: false
    });
  }

  try {
    const data = await prisma.poll.create({
      data: {
        endsAt: new Date(Date.now() + length * 24 * 60 * 60 * 1000),
        options: {
          createMany: {
            data: options.map((option, index) => ({ index, option })),
            skipDuplicates: true
          }
        }
      },
      select: { createdAt: true, endsAt: true, id: true, options: true }
    });

    logger.info(`Created a poll ${data.id}`);

    return res.status(200).json({ poll: data, success: true });
  } catch (error) {
    logger.error(Errors.SomethingWentWrong);
    return res
      .status(500)
      .json({ error: 'Internal server error', success: false });
  }
}
