import { STATIC_ASSETS_URL } from "@lensshare/data/constants";

const getZoraChainInfo = (
  chain: number
): {
  name: string;
  logo: string;
} => {
  switch (chain) {
    case 1:
    case 5:
      return {
        name: chain === 1 ? 'Ethereum' : 'Goerli',
        logo: `${STATIC_ASSETS_URL}/images/chains/ethereum.svg`,
      };
    case 10:
    case 420:
      return {
        name: chain === 10 ? 'Optimism' : 'Optimism Testnet',
        logo: `${STATIC_ASSETS_URL}/images/chains/ethereum.svg`,
      };
    case 7777777:
    case 999:
      return {
        name: chain === 7777777 ? 'Zora' : 'Zora Testnet',
        logo: `${STATIC_ASSETS_URL}/images/chains/zora.png`,
      };
    case 8453:
    case 84531:
      return {
        name: chain === 8453 ? 'Base' : 'Base Testnet',
        logo: `${STATIC_ASSETS_URL}/images/chains/base.svg`,
      };
    case 424:
      return {
        name: 'PGN Network',
        logo: `${STATIC_ASSETS_URL}/images/chains/ethereum.svg`,
      };
      case 137:
      return {
        name: 'Polygon',
        logo: `${STATIC_ASSETS_URL}/images/chains/polygon.svg`,
      };
    default:
      return {
        name: 'Ethereum',
        logo: `${STATIC_ASSETS_URL}/images/chains/ethereum.svg`,
      };
  }
};

export default getZoraChainInfo;
