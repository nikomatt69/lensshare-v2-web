import type { AllowedToken } from '@lensshare/types/hey';

import { HEY_API_URL, LENSSHARE_API_URL } from '@lensshare/data/constants';
import axios from 'axios';

/**
 * Get all allowed tokens
 * @param callbackFn callback function
 * @returns all allowed tokens
 */
const getAllTokens = async (
  callbackFn?: (tokens: AllowedToken[]) => void
): Promise<AllowedToken[]> => {
  try {
    const response = await axios.get(`/api/token/all`);
    const { data } = response;
    callbackFn?.(data?.tokens || []);

    return data?.tokens || [];
  } catch (error) {
    throw error;
  }
};

export default getAllTokens;
