import type { Handler } from 'express';
import type { Address } from 'viem';

import logger from '@lensshare/lib/logger';
import catchedError from '@utils/catchedError';
import { CACHE_AGE_INDEFINITE, RPC_URL } from '@utils/constants';
import { noBody } from '@utils/responses';
import { createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';

export const get: Handler = async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return noBody(res);
  }

  try {
    const client = createPublicClient({
      chain: polygon,
      transport: http(RPC_URL)
    });

    const bytecode = await client.getBytecode({
      address: address as Address
    });

    const deployed = bytecode?.length === 348;
    logger.info(`TBA status fetched: ${address}`);

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_INDEFINITE)
      .json({ deployed, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
