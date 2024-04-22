import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { object, string, number, array } from 'zod';
import allowCors from 'src/utils/allowCors';
import validateLensAccount from 'src/utils/middlewares/validateLensAccount';
import parseJwt from '@lensshare/lib/parseJwt';
import { polygon } from 'viem/chains';
import { parseHTML } from 'linkedom';
import getPolymarket from 'src/utils/oembed/meta/getPolymarket';

type PolymarketRequest = {
  buttonIndex: number;
  marketId: string;
  marketQuestion: string;
  publicationId: string;
  conditionId: string;
  outcomes: string[];
  marketUrl: string;
};

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
    return res.status(405).end(); // Method Not Allowed
  }

  const { body } = req;
  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  // Adjust validateLensAccount middleware for Next.js or inline its logic here
  if (!(await validateLensAccount(req))) {
    return res.status(403).json({ error: 'Invalid Lens account' });
  }

  const { marketId, marketQuestion, publicationId, conditionId, outcomes, marketUrl } = body as PolymarketRequest;
  try {
  const payload = parseJwt(accessToken);
    const { evmAddress, id } = payload;

    const untrustedData = {
      address: evmAddress,
      marketId,
      marketQuestion,
      conditionId,
      outcomes,
      fid: id,
      network: polygon.id,
      profileId: id,
      publicationId,
      timestamp: Date.now(),
      url: marketUrl
    };

    const { data } = await axios.post(
      marketUrl,
      { trustedData: untrustedData, untrustedData },
      { headers: { 'User-Agent': 'HeyBot/0.1 (like TwitterBot)' } }
    );

    const { document } = parseHTML(data);

    console.info(`Open frame button clicked by ${id} on ${marketUrl}`);

    return res.status(200).json({ polymarket :getPolymarket(document), success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default allowCors(handler);