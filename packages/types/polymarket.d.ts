// Types for Polymarket-related data
export  interface PolymarketMarketData {
  title: string;
  description: string;
  outcomes: string[];
  marketId: string;
  imageUrl: string;
  currentPrices: number[];
  totalVolume: number;
}
