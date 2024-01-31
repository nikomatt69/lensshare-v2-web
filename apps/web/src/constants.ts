import { IS_MAINNET } from '@lensshare/data/constants';
import { polygon, polygonMumbai } from 'wagmi/chains';

// Web3


export const CHAIN_ID = IS_MAINNET ? polygon.id : polygon.id;
