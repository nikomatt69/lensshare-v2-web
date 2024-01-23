import { Errors } from '@lensshare/data/errors';
import allowCors from '@utils/allowCors';
import { CACHE_AGE } from '@utils/constants';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { handle, slug } = req.query;

  if (!handle || !slug) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const soundResponse = await fetch('https://api.sound.xyz/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-agent': 'LensShare.xyz',
        'X-Sound-Client-Key': '91f01600-9b59-4dbb-a55d-e391a9f5f7c4'
      },
      body: JSON.stringify({
        operationName: 'MintedRelease',
        query: `
          query MintedRelease($releaseSlug: String!, $soundHandle: String!) {
            mintedRelease(releaseSlug: $releaseSlug, soundHandle: $soundHandle) {
              title
              numSold
              coverImage {
                url
                dominantColor
              }
              track {
                normalizedPeaks
                audio {
                  audio256k {
                    url
                  }
                }
              }
              artist {
                name
                user {
                  avatar {
                    url
                  }
                }
              }
            }
          }
        `,
        variables: { releaseSlug: slug, soundHandle: handle }
      }),
    });
    const release: { data: { mintedRelease: any } } = await soundResponse.json();

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({ success: true, release: release.data.mintedRelease });
  } catch (error) {
    console.error(error); // Log the error instead of throwing it
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export default allowCors(handler);