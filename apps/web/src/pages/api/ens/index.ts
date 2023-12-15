import { Errors } from '@lensshare/data/errors';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'src/utils/allowCors';
import { resolverAbi } from 'src/utils/ens/resolverAbi';
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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res.status(400).json({ success: false, error: Errors.SomethingWentWrong });
  }

  const { addresses } = body as ExtensionRequest;

  try {
    const client = createPublicClient({
      chain: mainnet,
      transport: http('https://ethereum.publicnode.com')
    });

    const data = await client.readContract({
      address: '0x3671ae578e63fdf66ad4f3e12cc0c0d71ac7510c',
      abi: resolverAbi,
      args: [addresses],
      functionName: 'getNames'
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
