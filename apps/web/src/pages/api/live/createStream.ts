import { Errors } from '@lensshare/data/errors';
import parseJwt from '@lensshare/lib/parseJwt';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'src/utils//allowCors';
import { boolean, object } from 'zod';

type ExtensionRequest = {
  record: boolean;
};
const LIVEPEER_API_KEY = '9e17a7ab-3370-4e31-85c3-43072da2315e';
const validationSchema = object({
  record: boolean()
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res
      .status(400)
      .json({ success: false, error: Errors.SomethingWentWrong });
  }

  const { record } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);
    const livepeerResponse = await fetch('https://livepeer.studio/api/stream', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${LIVEPEER_API_KEY}`
      },
      body: JSON.stringify({
        name: `${payload.id}-${crypto.randomUUID()}`,
        record,
        profiles: [
          { name: '720p0', fps: 0, bitrate: 3000000, width: 1280, height: 720 },
          {
            name: '1080p0',
            fps: 0,
            bitrate: 6000000,
            width: 1920,
            height: 1080
          }
        ]
      })
    });

    const result = await livepeerResponse.json();

    return res.status(200).json({ success: true, result });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
