
import { BASE_URL, LENSSHARE_API_URL } from '@lensshare/data/constants';
import axios from 'axios';

/**
 * Get TBA status of an address
 * @param address address
 * @param callbackFn callback function
 * @returns TBA status
 */
const getTbaStatus = async (
  address: string,
  callbackFn?: (deployed: boolean) => void
): Promise<boolean> => {
  if (!address) {
    return false;
  }

  try {
    const response = await axios.get(`${LENSSHARE_API_URL}/tba/deployed`, {
      params: { address },
      headers: { 'Access-Control-Allow-Origin': 'https://api.mycrumbs.xyz' }
    });
    const { data } = response;
    callbackFn?.(data?.deployed || false);

    return data?.deployed || false;
  } catch (error) {
    throw error;
  }
};

export default getTbaStatus;
