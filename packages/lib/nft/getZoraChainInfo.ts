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
        logo: `https://static-assets.hey.xyz/images/chains/ethereum.svg`
      };
    case 10:
    case 420:
      return {
        name: chain === 10 ? 'Optimism' : 'Optimism Testnet',
        logo:  `https://static-assets.hey.xyz/images/chains/optimism.svg`
      };
    case 7777777:
    case 999:
      return {
        name: chain === 7777777 ? 'Zora' : 'Zora Testnet',
        logo:  `https://static-assets.hey.xyz/images/chains/zora.svg`
      };
    case 8453:
    case 84531:
      return {
        name: chain === 8453 ? 'Base' : 'Base Testnet',
        logo:  `https://static-assets.hey.xyz/images/chains/base.svg`
      };
    case 424:
      return {
        name: 'PGN Network',
        logo:  `https://static-assets.hey.xyz/images/chains/pgn.svg`
      };
    default:
      return {
        name: 'Ethereum',
        logo:  `https://static-assets.hey.xyz/images/chains/ethereum.svg`
      };
  }
};

export default getZoraChainInfo;
