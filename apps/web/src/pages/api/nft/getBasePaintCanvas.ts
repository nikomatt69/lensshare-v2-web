import { Errors } from '@lensshare/data/errors';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'src/utils/allowCors';
import { CACHE_AGE } from 'src/utils/constants';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const basePaintResponse = await fetch('https://basepaint.art/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-agent': 'Hey.xyz'
      },
      body: JSON.stringify({
        query: `
          query Canvas {
            canvass(first: 1, orderDirection: "ASC") {
              id
            }
            canvas(id: ${id}) {
              id
              palette
              theme
              totalEarned
              totalMints
              pixelsCount
              bitmap {
                gif
              }
              contributions(first: 1000, orderBy: "pixelsCount", orderDirection: "ASC") {
                id
              }
            }
          }
        `
      })
    });
    const canvas: {
      data: {
        canvass: { id: number }[];
        canvas: any;
      };
    } = await basePaintResponse.json();
    const numberId = parseInt(id as string);
    const currentCanvas = canvas.data.canvass[0].id;

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({
        success: true,
        canvas:
          {
            canContribute: currentCanvas === numberId,
            canMint: currentCanvas - 1 === numberId,
            ...canvas.data.canvas
          } || null
      });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
