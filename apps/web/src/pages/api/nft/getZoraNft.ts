import { Errors } from '@lensshare/data/errors';
import getZoraChainIsMainnet from '@lensshare/lib/nft/getZoraChainIsMainnet';
import type { NextApiRequest, NextApiResponse } from 'next';
import urlcat from 'urlcat';
import allowCors from 'src/utils/allowCors';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from 'src/utils/constants';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { chain, address, token } = req.query;

  if (!chain || !address) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const network = getZoraChainIsMainnet(chain as string) ? '' : 'testnet.';
    const zoraResponse = await fetch(
      urlcat(
        `https://${network}zora.co/api/personalize/collection/:chain::address/:token`,
        { chain, address, token: token || 0 }
      )
    );
    const nft: { collection: any } = await zoraResponse.json();

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ success: true, nft: nft.collection || null });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
