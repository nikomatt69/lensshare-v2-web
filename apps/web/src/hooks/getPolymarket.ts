// src/lib/polymarketUtils.js
import { PolymarketMarketData } from '@lensshare/types/polymarket';
import axios from 'axios';
import { useEffect, useState } from 'react';

const POLYMARKET_API_URL = 'https://clob-staging.polymarket.com/';

/**
 * Extracts the market ID from a Polymarket URL.
 * @param {string} url - The full URL from Polymarket.
 * @returns {string | null} - The market ID or null if not found.
 */
export function extractMarketId(url: string) {
  const regex = /polymarket\.com\/market\/([^\/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Fetches market data from Polymarket's API given a market ID.
 * @param {string} marketId - The market ID to fetch.
 * @returns {Promise<Object>} - The market data as a JSON object.
 */
export async function fetchMarketData(marketId: string) {
  try {
    const response = await axios.get(`${POLYMARKET_API_URL}/${marketId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch market data:', error);
    throw new Error('Failed to fetch market data');
  }
}


/**
 * Hook to fetch and manage Polymarket market data.
 * @param marketId The market ID to fetch data for.
 */
export const usePolymarketData = (marketId: string) => {
  const [marketData, setMarketData] = useState<PolymarketMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchMarketData(marketId)
      .then(setMarketData)
      .catch(err => {
        setError(err.message);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [marketId]);

  return { marketData, loading, error };
};