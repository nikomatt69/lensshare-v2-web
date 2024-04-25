// src/utils/getPolymarket.ts
import type { Document } from 'linkedom';
import type { PolymarketMarketData } from '@lensshare/types/polymarket';

/**
 * Parses a Document object to extract metadata relevant to a Polymarket market.
 * @param document - The Document object parsed from an HTML response.
 * @param url - The original URL fetched, used as a fallback for the market URL.
 * @returns A PolymarketMarketData object or null if essential data can't be extracted.
 */
const getPolymarket = (document: Document, url?: string): PolymarketMarketData | null => {
  const getMeta = (key: string) => {
    const selector = `meta[name="${key}"], meta[property="${key}"]`;
    const metaTag = document.querySelector(selector);
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const parseMetaContentToList = (content: string | null): string[] => content ? content.split('|') : [];

  const title = getMeta('pm:title');
  const description = getMeta('pm:description');
  const outcomes = parseMetaContentToList(getMeta('pm:outcomes'));
  const marketId = getMeta('pm:market_id');
  const imageUrl = getMeta('pm:image_url');
  const currentPrices = parseMetaContentToList(getMeta('pm:current_prices')).map(Number);
  const totalVolume = parseFloat(getMeta('pm:total_volume') || '0');

  if (!marketId || !title || outcomes.length === 0 || currentPrices.length === 0) {
    return null; // Ensuring all essential data is present
  }

  return {
    title,
    description: description ?? '',
    outcomes,
    marketId,
    imageUrl: imageUrl ?? '',
    currentPrices,
    totalVolume
  };
};

export default getPolymarket;