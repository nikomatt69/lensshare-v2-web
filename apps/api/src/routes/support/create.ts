import type { Handler } from 'express';

import logger from '@lensshare/lib/logger';
import catchedError from '@utils/catchedError';
import createZendeskClient from '@utils/createZendeskClient';
import { invalidBody, noBody } from '@utils/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  email: string;
  handle: string;
  message: string;
  subject: string;
};

const validationSchema = object({
  email: string().email(),
  handle: string().min(1).max(100),
  message: string().min(1).max(5000),
  subject: string().min(1).max(100)
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

  const { email, message, subject } = body as ExtensionRequest;

  try {
    const client = createZendeskClient();
    const ticket = await client.tickets.create({
      ticket: {
        assignee_email: 'yogi@lensshare.xyz',
        comment: { body: message },
        requester: {
          email,
          name: email
        },
        subject
      }
    });
    logger.info('Support Ticket created');

    return res.status(200).json({ success: true, ticket });
  } catch (error) {
    return catchedError(res, error);
  }
};
