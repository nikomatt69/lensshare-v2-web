import { BASE_URL, HEY_API_URL, OEMBED_WORKER_URL } from '@lensshare/data/constants';
import type { OG } from '@lensshare/types/misc';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import urlcat from 'urlcat';

import Embed from './Embed';
import Player from './Player';
import getFavicon from 'src/utils/oembed/getFavicon';
import Portal from './Portal/Portal index';


interface OembedProps {
  className?: string;
  publicationId?: string;
  url?: string;
}

const Oembed: FC<OembedProps> = ({
  className = '',

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
    queryKey: ['oembed', url],
    refetchOnMount: false
  });

  if (isLoading || error || !data) {
    return null;
  }

  const og: OG = {
    description: data?.description,
    favicon: getFavicon(data.url),
    html: data?.html,
    image: data?.image,
    isLarge: data?.isLarge,
    portal: data?.portal,
    site: data?.site,
    title: data?.title,
    url: url as string
  };

  if (!og.title && !og.html) {
    return null;
  }

  return (
    <div className={className}>
      {og.html ? (
        <Player og={og} />
      ) : og.portal ? (
        <Portal portal={og.portal} publicationId={publicationId} />
      ) : (
        <Embed og={og} publicationId={publicationId} />
      )}
    </div>
  );
};

export default Oembed;