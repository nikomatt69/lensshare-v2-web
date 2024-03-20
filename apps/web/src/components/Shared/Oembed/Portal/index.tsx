import { useState, type FC, useEffect } from 'react';

import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import type { Portal as IPortal } from '@lensshare/types/misc';
import { Button, Card } from '@lensshare/ui';
import { PUBLICATION } from '@lensshare/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { Errors } from '@lensshare/data/errors';
import toast from 'react-hot-toast';
import cn from '@lensshare/ui/cn';
import { useAppStore } from 'src/store/useAppStore';
import getAuthApiHeaders from './getAuthApiHeaders main';
import { LinkIcon } from '@heroicons/react/24/outline';

interface PortalProps {
  portal: IPortal;
  publicationId?: string;
}

const Portal: FC<PortalProps> = ({ portal, publicationId }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [portalData, setPortalData] = useState<IPortal | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (portal) {
      setPortalData(portal);
    }
  }, [portal]);

  if (!portalData) {
    return null;
  }

  const { buttons, image, portalUrl, postUrl } = portalData;

  const onPost = async (index: number) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setIsLoading(true);

      const { data }: { data: { portal: IPortal } } = await axios.post(
        `/api/act`,
        { buttonIndex: index + 1, postUrl, publicationId },
        { headers: getAuthApiHeaders() }
      );

      if (!data.portal) {
        return toast.error(Errors.SomethingWentWrong);
      }

      return setPortalData(data.portal);
    } catch {
      toast.error(Errors.SomethingWentWrong);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
      <img
        alt={image}
        className="object-fit h-[full] w-[full] rounded-t-xl"
        src={image}
      />
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
                const url = action === 'mint' ? portalUrl : target || portalUrl;
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
  );
};

export default Portal;
