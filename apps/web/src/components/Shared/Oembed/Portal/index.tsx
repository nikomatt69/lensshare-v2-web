import { useState, type FC, useEffect } from 'react';

import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import { Portal } from '@lensshare/types/misc';
import { Button, Card } from '@lensshare/ui';
import { PUBLICATION } from '@lensshare/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { Errors } from '@lensshare/data/errors';
import toast from 'react-hot-toast';
import cn from '@lensshare/ui/cn';
import { useAppStore } from 'src/store/useAppStore';
import getAuthApiHeaders from './getAuthApiHeaders main';

interface PortalProps {
  portal: Portal;
  publicationId?: string;
}

const Portal: FC<PortalProps> = ({ portal, publicationId }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [portalData, setPortalData] = useState<null | Portal>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (portal) {
      setPortalData(portal);
    }
  }, [portal]);

  if (!portalData) {
    return null;
  }

  const { buttons, image, postUrl } = portalData;

  const onPost = async (index: number) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setLoading(true);

      const { data }: { data: { portal: Portal } } = await axios.post(
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
      setLoading(false);
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
        {buttons.map(({ button, type }, index) => (
          <Button
            disabled={loading || !publicationId || !currentProfile}
            key={index}
            onClick={() => {
              Leafwatch.track(PUBLICATION.NEW_POST, {
                publication_id: publicationId,
                type
              });

              if (type === 'redirect') {
                window.open(postUrl, '_blank');
              } else if (type === 'submit') {
                onPost(index);
              }
            }}
            outline
            size="lg"
            className="flex-grow"
            type={type === 'submit' ? 'submit' : 'button'}
            variant="secondary"
          >
            {button}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default Portal;
