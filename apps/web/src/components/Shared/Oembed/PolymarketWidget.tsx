import React, { useState, useEffect, FC } from 'react';
import { useAccount, useWalletClient,  } from 'wagmi';
import { ethers } from 'ethers';
import { ClobClient } from '@polymarket/clob-client';

import { CHAIN_ID } from '@lensshare/data/constants';
import walletClient from '@lib/walletClient';
import useEthersWalletClient from 'src/hooks/useEthersWalletClient';

import type { MarketInfo as IMarketInfo } from '@lensshare/types/misc';
interface PortalProps {
  questionId: IMarketInfo;
  publicationId?: string;
}
const PolymarketWidget : FC<PortalProps> = ({ questionId, publicationId }) => {
  const [marketData, setMarketData] = useState<any>(null);
  const { isConnected } = useAccount();
  
const { data: signer } = useWalletClient();


  useEffect(() => {
    if (!isConnected || !signer) return;

    const fetchMarketData = async () => {
      try {
        const clobClient = new ClobClient('https://clob.polymarket.com/', CHAIN_ID, walletClient(signer.account.address));
        const market = await clobClient.getMarket(questionId as unknown as string);
        setMarketData(market);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
      }
    };
    fetchMarketData();
  }, [isConnected, signer, questionId]);

  return (
    <div className="p-4 shadow-lg rounded-lg bg-white">
      {marketData ? (
        <div>
          <h3 className="text-lg font-bold">Market: {marketData.question.metadata}</h3>
          <p>Current Price: {marketData.outcomePrices.join(' / ')}</p>
        </div>
      ) : (
        <p>Loading market data...</p>
      )}
    </div>
  );
};

export default PolymarketWidget;