import type { Handler } from 'express';

import logger from '@lensshare/lib/logger';
import { NodeIrys } from '@irys/sdk';
import catchedError from 'src/lib/catchedError';
import { noBody } from 'src/lib/responses';

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  try {
    const url = 'https://node2.irys.xyz';
    const token = 'matic';
    const client = new NodeIrys({
      key: process.env.IRYS_PRIVATE_KEY,
      token,
      url
    });

    const receipt = await client.upload(JSON.stringify(body), {
      tags: [
        { name: 'content-type', value: 'application/json' },
        { name: 'App-Name', value: 'MyCrumbs.xyz' }
      ]
    });
    logger.info(`Uploaded metadata to Irys: ar://${receipt.id}`);

    return res.status(200).json({ id: receipt.id, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
