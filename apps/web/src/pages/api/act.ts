import type { NextApiRequest, NextApiResponse } from 'next';
import logger from '@lensshare/lib/logger';
import parseJwt from '@lensshare/lib/parseJwt';
import axios from 'axios';
import { parseHTML } from 'linkedom';

import { polygon } from 'viem/chains';
import { number, object, string } from 'zod';
import getPortal from 'src/utils/oembed/meta/getPortal';
import validateLensAccount from 'src/utils/middlewares/validateLensAccount';
import { error } from 'console';
import allowCors from 'src/utils/allowCors';

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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { body } = req;

  if (!body) {
    return error(res);
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return error(res);
  }

  // Adjust validateLensAccount middleware for Next.js or inline its logic here
  if (!(await validateLensAccount(req))) {
    return error(res);
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
      { headers: { 'User-Agent': 'MyCrumbs' } }
    );

    const { document } = parseHTML(data);

    logger.info(`Portal button clicked by ${id} on ${postUrl}`);

    return res.status(200).json({ portal: getPortal(document), success: true });
  } catch (error) {
    return error;
  }
}

export default allowCors(handler);
