import type { Feature } from '@lensshare/types/hey';

import { HEY_API_URL } from '@lensshare/data/constants';
import axios from 'axios';

/**
 * Get all features
 * @param headers auth headers
 * @param callbackFn callback function
 * @returns all features
 */
const getAllFeatureFlags = async (
  headers: any,
  callbackFn?: (flags: Feature[]) => void
): Promise<Feature[]> => {
  try {
    const response = await axios.get(`/api/internal/feature/all`, {
      headers
    });
    const { data } = response;
    callbackFn?.(data?.features || []);

    return data?.features || [];
  } catch (error) {
    throw error;
  }
};

export default getAllFeatureFlags;
