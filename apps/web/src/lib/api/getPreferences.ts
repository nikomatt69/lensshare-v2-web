import type { Preferences } from '@lensshare/types/hey';

import { BASE_URL, HEY_API_URL, LENSSHARE_API_URL, PREFERENCES_WORKER_URL } from '@lensshare/data/constants';
import axios from 'axios';

/**
 * Get user preferences
 * @param id user id
 * @param headers auth headers
 * @returns user preferences
 */
const getPreferences = async (
  id: string,
  headers: any
): Promise<Preferences> => {
  try {
    const response: { data: { result: Preferences } } = await axios.get(
      `${LENSSHARE_API_URL}/preference/getPreferences`,
      { headers, params: { id } }
    );

    return response.data.result;
  } catch {
    return {
      features: [],
      membershipNft: { dismissedOrMinted: false },
      preference: null,
      pro: { enabled: false }
    };
  }
};

export default getPreferences;
