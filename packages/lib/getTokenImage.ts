import { STATIC_ASSETS_URL } from '@lensshare/data/constants';

/**
 * Returns the URL for the token image with the specified symbol.
 *
 * @param symbol The token symbol.
 * @returns The token image URL.
 */
const getTokenImage = (symbol: string): string => {
  const symbolLowerCase = symbol?.toLowerCase() ?? '';
  return `${STATIC_ASSETS_URL}/images/tokens/${symbolLowerCase}.svg`;
};

export default getTokenImage;
