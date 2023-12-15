import { STATIC_ASSETS_URL } from '@lensshare/data/constants';

interface WalletDetails {
  name: string;
  logo: string;
}

/**
 * Returns an object with the name and logo URL for the specified wallet name.
 *
 * @param name The wallet name.
 * @returns An object with the name and logo URL.
 */
const getWalletDetails = (name: string): WalletDetails => {
  const walletDetails: Record<string, WalletDetails> = {
   
    'Coinbase Wallet': {
      name: 'Coinbase Wallet',
      logo: `${STATIC_ASSETS_URL}/coinbase.svg`
    },
    'Dynamic Wallet': {
      name: 'Dynamic Wallet',
      logo: `${STATIC_ASSETS_URL}/dynamic.svg`
    }
  };
  const defaultDetails: WalletDetails = {
    name,
    logo: `${STATIC_ASSETS_URL}/wallets/browser-wallet.svg`
  };

  return walletDetails[name] || defaultDetails;
};

export default getWalletDetails;
