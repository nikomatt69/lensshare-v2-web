import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import { describe, expect, test } from 'vitest';

import getTokenImage from './getTokenImage';

describe('getTokenImage', () => {
  test('should return the correct image url for a given token symbol', () => {
    expect(getTokenImage('ETH')).toEqual(`${STATIC_ASSETS_URL}/tokens/eth.svg`);
    expect(getTokenImage('BTC')).toEqual(`${STATIC_ASSETS_URL}/tokens/btc.svg`);
  });

  test('should convert the token symbol to lowercase before generating the url', () => {
    expect(getTokenImage('Eth')).toEqual(`${STATIC_ASSETS_URL}/tokens/eth.svg`);
  });
});
