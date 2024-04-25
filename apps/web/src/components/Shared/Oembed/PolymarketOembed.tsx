import React from 'react';
import { Card, Button, Tooltip } from '@lensshare/ui';
import { PolymarketMarketData } from '@lensshare/types/polymarket';
import { usePolymarketData } from 'src/hooks/getPolymarket';


interface PolymarketOembedProps {
  marketId: string;
}

const PolymarketOembed: React.FC<PolymarketOembedProps> = ({ marketId }) => {
  const { marketData, loading, error } = usePolymarketData(marketId);

  if (loading) return <p>Loading market data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!marketData) return <p>No data found for this market.</p>;

  return (
    <Card className="p-4">
      <h3>{marketData.title}</h3>
      <p>{marketData.description}</p>
      <img src={marketData.imageUrl} alt="Market" />
      {marketData.outcomes.map((outcome, index) => (
        <Button key={index}>{`${outcome}: ${marketData.currentPrices[index]}`}</Button>
      ))}
      <Tooltip content="Visit Market">
        <a href={`https://polymarket.com/market/${marketId}`} target="_blank" rel="noopener noreferrer">
          <Button>View Market</Button>
        </a>
      </Tooltip>
    </Card>
  );
};

export default PolymarketOembed;
