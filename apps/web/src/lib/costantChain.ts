import { IS_MAINNET } from '@lensshare/data/constants';
import { polygon, polygonMumbai } from 'wagmi/chains';

export const CHAIN = IS_MAINNET ? polygon : polygonMumbai;