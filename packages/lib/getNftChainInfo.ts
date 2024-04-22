import { STATIC_ASSETS_URL } from '@lensshare/data/constants';

const getNftChainInfo = (
  chain: string
): {
  logo: string;
  name: string;
} => {
  switch (chain) {
    case 'ethereum':
    case 'goerli':
      return {
        logo: `${STATIC_ASSETS_URL}/images/chains/ethereum.svg`,
        name: chain === 'ethereum' ? 'Ethereum' : 'Goerli'
      };
    case 'optimism':
    case 'optimism-testnet':
      return {
        logo: `${STATIC_ASSETS_URL}/images/chains/ethereum.svg`,
        name: chain === 'optimism' ? 'Optimism' : 'Optimism Testnet'
      };
    case 'zora':
    case 'zora-testnet':
      return {
        logo: `${STATIC_ASSETS_URL}/images/chains/zora.png`,
        name: chain === 'zora' ? 'Zora' : 'Zora Testnet'
      };
    case 'base':
    case 'base-testnet':
      return {
        logo: `${STATIC_ASSETS_URL}/images/chains/base.svg`,
        name: chain === 'base' ? 'Base' : 'Base Testnet'
      };
    case 'polygon':
    case 'mumbai':
      return {
        logo: `${STATIC_ASSETS_URL}/images/chains/polygon.svg`,
        name: chain === 'polygon' ? 'Polygon' : 'Polygon Mumbai'
      };
    default:
      return {
        logo: `${STATIC_ASSETS_URL}/images/chains/ethereum.svg`,
        name: 'Ethereum'
      };
  }
};

export default getNftChainInfo;
