import { HEY_API_URL } from '@lensshare/data/constants';
import type { AllowedToken } from '@lensshare/types/hey';

import axios from 'axios';

/**
 * Get all allowed tokens
 * @param callbackFn callback function
 * @returns all allowed tokens
 */
const getAllTokens = async (
  callbackFn?: (tokens: AllowedToken[]) => void
): Promise<AllowedToken[]> => {
  const response = await axios.get(`${HEY_API_URL}/tokens/all`);
  const { data } = response;
  callbackFn?.(data?.tokens || []);

  return data?.tokens || [];
};

export default getAllTokens;
