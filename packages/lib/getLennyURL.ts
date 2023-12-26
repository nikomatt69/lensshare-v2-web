
import { BASE_URL, LENSSHARE_API_URL } from '@lensshare/data/constants';
import urlcat from 'urlcat';

/**
 * Returns the lenny avatar URL for the specified Lenny ID.
 * @param id The Lenny ID to get the URL for.
 * @returns The lenny avatar URL.
 */
const getLennyURL = (id: string): string => {
  return urlcat(`${LENSSHARE_API_URL}/avatar`, { id });
};

export default getLennyURL;
