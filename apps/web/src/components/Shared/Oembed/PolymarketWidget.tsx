import React, { useState, useEffect, FC } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ClobClient } from '@polymarket/clob-client';

import { CHAIN_ID } from '@lensshare/data/constants';
// Ensure this is the correct import path

import type { PolymarketMarketData } from '@lensshare/types/polymarket';  // Ensure your type path is correct
import walletClient from '@lib/walletClient';
import { AnyPublication, UnknownOpenActionModuleSettings } from '@lensshare/lens';

interface PolymarketWidgetProps {
  marketId: string;
  publication: AnyPublication;
  module : UnknownOpenActionModuleSettings
}

const PolymarketWidget: FC<PolymarketWidgetProps> = ({ marketId, publication,module }) => {
  const [marketData, setMarketData] = useState<PolymarketMarketData | null>(null);
  const { isConnected } = useAccount();
  const { data: wallet } = useWalletClient();  // Assuming useWalletClient returns an object with 'data' that includes a signer
  
  useEffect(() => {
    if (!isConnected || !wallet) {
      console.error("Wallet not connected or signer not available");
      return;
    }

    const fetchMarketData = async () => {
      try {
        const clobClient = new ClobClient('https://clob-staging.polymarket.com/', CHAIN_ID, walletClient(wallet.account.address));
        const market = await clobClient.getMarket(marketId);
        setMarketData({
          title: market.question,
          description: market.description,
          outcomes: market.outcomes.map((o: any) => o.name),  // Adjust this mapping as needed based on the actual data structure
          marketId,
          imageUrl: market.imageUrl,  // Adjust this field based on actual response structure
          currentPrices: market.currentPrices,  // This should match the structure of the data provided by the ClobClient
          totalVolume: market.totalVolume  // Adjust if the actual data has different fields
        });
      } catch (error) {
        console.error("Failed to fetch market data:", error);
      }
    };

    fetchMarketData();
  }, [isConnected, wallet, marketId]);

  return (
    <div className="p-4 shadow-lg rounded-lg bg-white">
      {marketData ? (
        <div>
          <h3 className="text-lg font-bold">Market: {marketData.title}</h3>
          <p>{marketData.description}</p>
          <div>
            {marketData.outcomes.map((outcome: string, index: number) => (
              <p key={index}>{outcome} - Current Price: {marketData.currentPrices[index]}</p>
            ))}
          </div>
          <img src={marketData.imageUrl} alt="Market Cover" className="w-full h-64 object-cover" />
        </div>
      ) : (
        <p>Loading market data...</p>
      )}
    </div>
  );
};

export default PolymarketWidget;