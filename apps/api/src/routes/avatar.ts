import type { Handler } from 'express';

import { LensHub } from '@lensshare/abis';
import { IPFS_GATEWAY, IS_MAINNET, LENSHUB_PROXY } from '@lensshare/data/constants';
import logger from '@lensshare/lib/logger';
import { CACHE_AGE_INDEFINITE_ON_DISK, RPC_URL } from '@utils/constants';
import { noBody } from '@utils/responses';
import { createPublicClient, http } from 'viem';
import { polygon, polygonMumbai } from 'viem/chains';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const client = createPublicClient({
      chain: IS_MAINNET ? polygon : polygonMumbai,
      transport: http(RPC_URL)
    });

    const data: any = await client.readContract({
      abi: LensHub,
      address: LENSHUB_PROXY,
      args: [id],
      functionName: 'tokenURI'
    });

    const jsonData = JSON.parse(
      Buffer.from(data.split(',')[1], 'base64').toString()
    );

    const base64Image = jsonData.image.split(';base64,').pop();
    const svgImage = Buffer.from(base64Image, 'base64').toString('utf-8');
    logger.info(`Downloaded Lenny avatar for ${id}`);

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_INDEFINITE_ON_DISK)
      .type('svg')
      .send(svgImage);
  } catch {
    const url = `${IPFS_GATEWAY}Qmb4XppdMDCsS7KCL8nCJo8pukEWeqL4bTghURYwYiG83i/cropped_image.png`;
    return res.status(302).redirect(url);
  }
};
