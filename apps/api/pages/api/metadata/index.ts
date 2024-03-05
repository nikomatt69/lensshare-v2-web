import { Errors } from '@lensshare/data/errors';
import { NodeIrys } from '@irys/sdk';
import allowCors from '@utils/allowCors';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const url = 'https://node2.irys.xyz';
    const token = 'matic';
    const client = new NodeIrys({
      url,
      token,
      key: process.env.IRYS_PRIVATE_KEY
    });

    const receipt = await client.upload(JSON.stringify(body), {
      tags: [
        { name: 'content-type', value: 'application/json' },
        { name: 'App-Name', value: 'MyCrumbs.xyz' }
      ]
    });

    return res.status(200).json({ success: true, id: receipt.id });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
