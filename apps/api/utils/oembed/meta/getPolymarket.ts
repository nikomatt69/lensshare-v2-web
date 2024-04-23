import type { ButtonType, MarketInfo } from '@lensshare/types/misc';
import type { Document } from 'linkedom';

const getPolymarket = (document: Document, url?: string): MarketInfo | null => {
  const getMeta = (key: string) => {
    const selector = `meta[name="${key}"], meta[property="${key}"]`;
    const metaTag = document.querySelector(selector);
    return metaTag ? metaTag.getAttribute('content') : null;
  };
  let buttons: MarketInfo['buttons'] = [];
  for (let i = 1; i < 5; i++) {
    const button = getMeta(`of:button:${i}`);
    const action = getMeta(`of:button:${i}:action`) as ButtonType;
    const target = getMeta(`of:button:${i}:target`) as string;

    if (!button) {
      break;
    }

    buttons.push({ action, button, target });
  }
  const marketId = getMeta('pm:market_id');
  const marketQuestion = getMeta('pm:market_question');

  const conditionId = getMeta('pm:condition_id');
  const outcomes = getMeta('pm:outcomes')?.split('|') || [];
  const marketUrl = url || '';

  if (!marketId || !marketQuestion || !conditionId || outcomes.length === 0) {
    return null;
  }

  return {
    buttons,
    marketId,
    marketQuestion,
    conditionId,
    outcomes,
    marketUrl
  };
};

export default getPolymarket;
