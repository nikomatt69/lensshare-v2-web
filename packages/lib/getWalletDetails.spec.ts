import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import { describe, expect, test } from 'vitest';

import getWalletDetails from './getWalletDetails';

describe('getWalletDetails', () => {
  test('should return correct details for WalletConnect', () => {
    const walletDetails = getWalletDetails('WalletConnect');
    expect(walletDetails.name).toBe('WalletConnect');
    expect(walletDetails.logo).toBe(
      `${STATIC_ASSETS_URL}/wallets/walletconnect.svg`
    );
  });

  test('should return correct details for Coinbase Waller', () => {
    const walletDetails = getWalletDetails('Coinbase Wallet');
    expect(walletDetails.name).toBe('Coinbase Wallet');
    expect(walletDetails.logo).toBe(
      `${STATIC_ASSETS_URL}/wallets/coinbase.svg`
    );
  });

  test('should return correct details for name other than WalletConnect', () => {
    const walletDetails = getWalletDetails('SomeOtherWallet');
    expect(walletDetails.name).toBe('SomeOtherWallet');
    expect(walletDetails.logo).toBe(
      `${STATIC_ASSETS_URL}/wallets/browser-wallet.svg`
    );
  });

  test('should handle empty string as input', () => {
    const walletDetails = getWalletDetails('');
    expect(walletDetails.name).toBe('');
    expect(walletDetails.logo).toBe(
      `${STATIC_ASSETS_URL}/wallets/browser-wallet.svg`
    );
  });
});
