import type { Preferences } from '@lensshare/types/hey';

import { HEY_API_URL } from '@lensshare/data/constants';
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
      `${HEY_API_URL}/preferences/get`,
      { headers: { 'Access-Control-Allow-Origin': 'https://api.mycrumbs.xyz' }, params: { id }, }
    );

    return response.data.result;
  } catch {
    return {
      features: [],
      hasDismissedOrMintedMembershipNft: false,
      highSignalNotificationFilter: false,
      isPride: false
    };
  }
};

export default getPreferences;
