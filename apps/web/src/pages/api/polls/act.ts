import type { NextApiRequest, NextApiResponse } from 'next';

import logger from '@lensshare/lib/logger';
import parseJwt from '@lensshare/lib/parseJwt';
import { object, string } from 'zod';
import validateLensAccount from 'src/utils/middlewares/validateLensAccount'; // Adjust this import as necessary
import prisma from 'src/utils/prisma';
import { Errors } from '@lensshare/data/errors';

type ExtensionRequest = {
  option: string;
  poll: string;
};

const validationSchema = object({
  option: string().uuid(),
  poll: string().uuid()
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
    res.status(400).json({ error: 'No body provided', success: false });
    return;
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    res.status(400).json({ error: 'Validation failed', success: false });
    return;
  }

  // Assuming validateLensAccount is an async function that returns a boolean
  if (!(await validateLensAccount(req))) {
    res.status(403).json({ error: 'Invalid Lens account', success: false });
    return;
  }

  const { option, poll } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);

    // Check if the poll expired
    const pollData = await prisma.poll.findUnique({
      where: { id: poll }
    });

    if (!pollData || pollData.endsAt.getTime() < Date.now()) {
      res.status(400).json({ error: 'Poll expired.', success: false });
      return;
    }

    // Check if the poll exists and delete the existing response
    const existingResponse = await prisma.pollResponse.findFirst({
      where: {
        option: { pollId: poll },
        profileId: payload.id
      }
    });

    if (existingResponse) {
      await prisma.pollResponse.delete({
        where: { id: existingResponse.id }
      });
    }

    const data = await prisma.pollResponse.create({
      data: { optionId: option, profileId: payload.id }
    });

    logger.info(`Responded to a poll ${option}:${data.id}`);

    res.status(200).json({ id: data.id, success: true });
  } catch (error) {
    logger.error(Errors.SomethingWentWrong);
    res.status(500).json({ error: 'Internal server error', success: false });
  }
}
