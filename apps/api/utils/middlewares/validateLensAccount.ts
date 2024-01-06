import LensEndpoint from '@lensshare/data/lens-endpoints';
import axios from 'axios';
import type { NextApiRequest } from 'next';

/**
 * Middleware to validate Lens access token
 * @param request Incoming request
 * @returns Response
 */
const validateLensAccount = async (request: NextApiRequest) => {
  const accessToken = request.headers['x-access-token'] as string;
  const network = request.headers['x-lens-network'] as string;
  const allowedNetworks = ['mainnet', 'testnet'];

  if (!accessToken || !network || !allowedNetworks.includes(network)) {
    return false;
  }

  const isMainnet = network === 'mainnet';
  const lensResponse = await axios.post(
    isMainnet ? LensEndpoint.Mainnet : LensEndpoint.Testnet,
    {
      query: `
        query Verify {
          verify(request: { accessToken: "${accessToken}" })
        }
      `
    },
    {
      headers: { 'Content-Type': 'application/json', 'User-agent': 'Hey.xyz' },
      withCredentials: true
    }
  );

  if (!lensResponse.data.verify) {
    return true;
  }
};

export default validateLensAccount;
