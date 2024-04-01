import type { Handler } from 'express';

import { HeyLensSignup } from '@lensshare/abis';
import { HEY_LENS_SIGNUP } from '@lensshare/data/constants';
import logger from '@lensshare/lib/logger';
import catchedError from 'src/lib/catchedError';
import {
  CACHE_AGE_INDEFINITE,
  RPC_URL,
  SWR_CACHE_AGE_10_MINS_30_DAYS
} from 'src/lib/constants';
import { noBody } from 'src/lib/responses';
import { createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';

// TODO: add tests
export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const client = createPublicClient({
      chain: polygon,
      transport: http(RPC_URL)
    });

    const isHeyProfile = await client.readContract({
      abi: HeyLensSignup,
      address: HEY_LENS_SIGNUP,
      args: [id],
      functionName: 'profileCreated'
    });

    logger.info(`Hey profile badge fetched for ${id}`);

    return res
      .status(200)
      .setHeader(
        'Cache-Control',
        isHeyProfile ? CACHE_AGE_INDEFINITE : SWR_CACHE_AGE_10_MINS_30_DAYS
      )
      .json({ isHeyProfile, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
