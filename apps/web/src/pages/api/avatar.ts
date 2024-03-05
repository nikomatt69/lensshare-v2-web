import { LensHub } from '@lensshare/abis';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CACHE_AGE } from 'src/utils/constants';
import { createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';

const ALCHEMY_API_KEY = 'ko67M7MTbwy-pJHRMi7VdhHemweoRzY';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const alchemyUrl = `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
    const client = createPublicClient({
      chain: polygon,
      transport: http(alchemyUrl)
    });

    const data: any = await client.readContract({
      address: '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d',
      abi: LensHub,
      functionName: 'tokenURI',
      args: [req.query.id]
    });

    const jsonData = JSON.parse(
      Buffer.from(data.split(',')[1], 'base64').toString()
    );

    const base64Image = jsonData.image.split(';base64,').pop();
    const svgImage = Buffer.from(base64Image, 'base64').toString('utf-8');

    res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .setHeader('Access-Control-Allow-Origin', '*')
      .send(svgImage);
  } catch {
    const url =
      'https://i.seadn.io/s/raw/files/b7a5afa354adaf5f988acd8b0ba2409e.jpg';
    res.status(302).redirect(url);
  }
}
