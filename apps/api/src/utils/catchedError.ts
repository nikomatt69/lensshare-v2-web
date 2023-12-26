import type { Response } from 'express';

import { Errors } from '@lensshare/data/errors';
import logger from '@lensshare/lib/logger';

const catchedError = (res: Response, error: any) => {
  logger.error(error);
  return res
    .status(500)
    .json({ error: Errors.SomethingWentWrong, success: false });
};

export default catchedError;
