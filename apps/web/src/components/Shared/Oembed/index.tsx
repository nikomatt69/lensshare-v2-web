import { BASE_URL, HEY_API_URL, OEMBED_WORKER_URL } from '@lensshare/data/constants';
import type { OG } from '@lensshare/types/misc';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import urlcat from 'urlcat';

import Embed from './Embed';
import Player from './Player';
import getFavicon from 'src/utils/oembed/getFavicon';


interface OembedProps {
  className?: string;
  onData?: (data: OG) => void;
  publicationId?: string;
  url?: string;
}

const Oembed: FC<OembedProps> = ({
  className = '',
  onData,
  publicationId,
  url
}) => {
  const { data, error, isLoading } = useQuery({
    enabled: Boolean(url),
    queryFn: async () => {
      const response = await axios.get(`/api/oembed`, {
        params: { url }
      });
      return response.data.oembed;
    },
    queryKey: ['oembed', url]
  });

  if (isLoading || error || !data) {
    return null;
  }

  onData?.(data);

  const og: OG = {
    description: data?.description,
    favicon: getFavicon(data.url),
    html: data?.html,
    image: data?.image,
    isLarge: data?.isLarge,
    site: data?.site,
    title: data?.title,
    url: url as string
  };

  if (!og.title) {
    return null;
  }

  return (
    <div className={className}>
      {og.html ? (
        <Player og={og} />
      ) : (
        <Embed og={og} publicationId={publicationId} />
      )}
    </div>
  );
};

export default Oembed;