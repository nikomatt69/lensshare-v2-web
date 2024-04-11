import { Errors } from '@lensshare/data/errors';
import logger from '@lensshare/lib/logger';
import type { NextApiResponse } from 'next';

const catchedError = (res: NextApiResponse, error: any) => {
  logger.error(error);
  return res
    .status(500)
    .json({ success: false, error: Errors.SomethingWentWrong });
};

export default catchedError;
