import { IS_MAINNET } from '@lensshare/data/constants';
import { polygon, polygonMumbai } from 'wagmi/chains';

// Web3
const POLYGON_MAINNET = {
  ...polygon,
  name: 'Polygon Mainnet',
  rpcUrls: { default: 'https://polygon.publicnode.com' }
};

export const CHAIN = IS_MAINNET ? polygon : polygon;
