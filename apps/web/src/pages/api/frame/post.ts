import parseJwt from '@lensshare/lib/parseJwt';
import axios from 'axios';
import { parseHTML } from 'linkedom';
import { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'src/utils/allowCors';
import validateLensAccount from 'src/utils/middlewares/validateLensAccount';
import getFrame from 'src/utils/oembed/meta/getFrame';
import { polygon } from 'viem/chains';
import { number, object, string } from 'zod';

type ExtensionRequest = {
  buttonIndex: number;
  postUrl: string;
  publicationId: string;
};

const validationSchema = object({
  buttonIndex: number(),
  postUrl: string(),
  publicationId: string()
});

// Default export for Next.js API route
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    // Handle non-POST requests
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { body } = req;

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  if (!(await validateLensAccount(req))) {
    return res.status(403).json({ error: 'Not allowed' });
  }

  const { buttonIndex, postUrl, publicationId } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);
    const { evmAddress, id } = payload;

    const untrustedData = {
      address: evmAddress,
      buttonIndex,
      fid: id,
      network: polygon.id,
      profileId: id,
      publicationId,
      timestamp: Date.now(),
      url: postUrl
    };

    const { data } = await axios.post(
      postUrl,
      { trustedData: untrustedData, untrustedData },
      { headers: { 'User-Agent': 'HeyBot/0.1 (like TwitterBot)' } }
    );

    const { document } = parseHTML(data);

    console.info(`Open frame button clicked by ${id} on ${postUrl}`);

    return res.status(200).json({ frame: getFrame(document), success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default allowCors(handler);
