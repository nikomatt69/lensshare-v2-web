
import allowCors from '@utils/allowCors';
import { Errors } from '@utils/errors';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { cid } = req.query;

  if (!cid) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const ipfsResponse = await fetch(`https://cl-api/pins/${cid}`, {
      method: 'POST'
    });

    const json: { cid: string } = await ipfsResponse.json();

    return res.status(200).json({ success: true, cid: json.cid });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
