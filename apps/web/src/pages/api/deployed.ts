import { RPC_URL } from '@lensshare/data/constants';
// Import Errors from the correct path
import logger from '@lensshare/lib/logger';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CACHE_AGE } from 'src/utils/constants';
import type { Address } from 'viem';

import { createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'No address provided' }); // Return a 400 error if no address is provided
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
    

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({ deployed, success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' }); // Return a 500 error if an error occurs
  }
}
