// src/pages/api/poly/post.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { object, string, number, array } from 'zod';
import allowCors from 'src/utils/allowCors';
import validateLensAccount from 'src/utils/middlewares/validateLensAccount';
import parseJwt from '@lensshare/lib/parseJwt';
import { parseHTML } from 'linkedom';
import getPolymarket from 'src/utils/oembed/meta/getPolymarket';

// Define the shape of the request body using zod
const validationSchema = object({
  buttonIndex: number(),
  marketId: string(),
  marketQuestion: string(),
  publicationId: string(),
  conditionId: string(),
  outcomes: array(string()),
  marketUrl: string(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');  // Clearly specify allowed method
  }

  // Validate request body against schema
  const validation = validationSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid request body', details: validation.error });
  }

  const { marketId, marketQuestion, publicationId, conditionId, outcomes, marketUrl } = validation.data;

  try {
    // Validate Lens account token
    const accessToken = req.headers['authorization']?.split(' ')[1] || '';
    if (!accessToken || !(await validateLensAccount(req))) {
      return res.status(403).json({ error: 'Unauthorized - Invalid Lens account or missing token' });
    }

    const decodedToken = parseJwt(accessToken);
    const { evmAddress } = decodedToken;

    // Attempt to fetch the Polymarket data from the URL
    const response = await axios.get(marketUrl);
    const { document } = parseHTML(response.data);
    const polymarketData = getPolymarket(document);

    // Log success for debugging purposes
    console.info(`Processed request for market ${marketId} by user ${evmAddress}`);

    return res.status(200).json({ polymarket: polymarketData, success: true });
  } catch (error) {
    console.error('Failed to process Polymarket data:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error });
  }
}

export default allowCors(handler);
