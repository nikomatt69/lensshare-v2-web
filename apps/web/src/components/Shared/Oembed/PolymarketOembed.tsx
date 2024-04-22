// src/components/Oembed/PolymarketOembed.tsx
import React, { useEffect, useState } from 'react';
import { Button, Card,  } from '@lensshare/ui';
import PolymarketWidget from './PolymarketWidget';
import { UnknownOpenActionModuleSettings } from '@lensshare/lens';
import { MarketInfo } from '@lensshare/types/misc';

import type { MarketInfo as IMarketInfo } from '@lensshare/types/misc';
import { useAppStore } from 'src/store/persisted/useAppStore';
import axios from 'axios';
import getAuthApiHeaders from './Portal/getAuthApiHeaders main';
import toast from 'react-hot-toast';
import { Errors } from '@lensshare/data/errors';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import cn from '@lensshare/ui/cn';
import { LinkIcon } from '@heroicons/react/24/outline';
import { Leafwatch } from '@lib/leafwatch';
import { PUBLICATION } from '@lensshare/data/tracking';
const PolymarketOembed: React.FC<{ publicationId:string, questionId: MarketInfo }> = ({ publicationId , questionId }) => {

    const { currentProfile } = useAppStore();
    const [marketData, setMarketData] = useState<IMarketInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      if (questionId) {
        setMarketData(questionId);
      }
    }, [questionId]);
  
    if (!marketData) {
      return null;
    }
  
    const { marketId,     
    marketQuestion  , 
    buttons,
    conditionId ,   
    outcomes,      
    marketUrl ,    } = marketData;
  
    const onPost = async (index: number) => {
      if (!currentProfile) {
        return toast.error(Errors.SignWallet);
      }
  
      try {
        setIsLoading(true);
  
        const { data }: { data: { polymarket: IMarketInfo } } = await axios.post(
          `/api/poly/post`,
          { buttonIndex: index + 1,  marketId,     
            marketQuestion  , 
            publicationId,
            conditionId ,   
            outcomes,      
            marketUrl ,    },
          { headers: getAuthApiHeaders() }
        );
  
        if (!data.polymarket) {
          return toast.error(Errors.SomethingWentWrong);
        }
  
        return setMarketData(data.polymarket);
      } catch {
        toast.error(Errors.SomethingWentWrong);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (<Card className="mt-3" forceRounded onClick={stopEventPropagation}>
    <PolymarketWidget questionId={questionId}/>
    <div
      className={cn(
        buttons.length === 1 && 'grid-cols-1',
        buttons.length === 2 && 'grid-cols-2',
        buttons.length === 3 && 'grid-cols-3',
        buttons.length === 4 && 'grid-cols-2',
        'grid gap-4 p-5 dark:border-gray-700'
      )}
    >
       {buttons.map(({ action, button, target }, index) => (
        <Button
          className="justify-center"
          disabled={isLoading || !publicationId || !currentProfile}
          icon={
            (action === 'link' ||
              action === 'post_redirect' ||
              action === 'mint') && <LinkIcon className="h-4 w-4" />
          }
          key={index}
          onClick={() => {
            Leafwatch.track(PUBLICATION.CLICK_OEMBED, {
              action,
              publication_id: publicationId
            });

            if (
              action === 'link' ||
              action === 'post_redirect' ||
              action === 'mint'
            ) {
              const url = action === 'mint' ? marketUrl : target || marketUrl;
              window.open(url, '_blank');
            } else if (action === 'post') {
              onPost(index);
            }
          }}
          outline
          size="md"
          type={
            action === 'post' || action === 'post_redirect'
              ? 'submit'
              : 'button'
          }
        >
          {button}
        </Button>
      ))}
    </div>
  </Card>
); };

export default PolymarketOembed;
