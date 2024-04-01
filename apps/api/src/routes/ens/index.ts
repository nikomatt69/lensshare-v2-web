import type { Handler } from 'express';

import logger from '@lensshare/lib/logger';
import catchedError from 'src/lib/catchedError';
import { resolverAbi } from 'src/lib/ens/resolverAbi';
import { invalidBody, noBody } from 'src/lib/responses';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { array, object, string } from 'zod';

type ExtensionRequest = {
  addresses: string[];
};

const validationSchema = object({
  addresses: array(string().regex(/^(0x)?[\da-f]{40}$/i)).max(100, {
    message: 'Too many addresses!'
  })
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

  const { addresses } = body as ExtensionRequest;

  try {
    const client = createPublicClient({
      chain: mainnet,
      transport: http('https://ethereum.publicnode.com')
    });

    const result = await client.readContract({
      abi: resolverAbi,
      address: '0x3671ae578e63fdf66ad4f3e12cc0c0d71ac7510c',
      args: [addresses],
      functionName: 'getNames'
    });
    logger.info('ENS names fetched');

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
