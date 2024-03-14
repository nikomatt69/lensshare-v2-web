import { BASE_URL, HEY_API_URL, OEMBED_WORKER_URL } from '@lensshare/data/constants';
import type { OG } from '@lensshare/types/misc';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import urlcat from 'urlcat';

import Embed from './Embed';
import Player from './Player';
import getFavicon from 'src/utils/oembed/getFavicon';

import Nft from './Nft';
import { AnyPublication } from '@lensshare/lens';
import Portal from './Portal';
import DecentOpenAction from '@components/Publication/LensOpenActions/Decent 2';
import { VerifiedOpenActionModules } from '@lensshare/data/verified-openaction-modules';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';


interface OembedProps {
  className?: string;
  openActionEmbed?: boolean;
  openActionEmbedLoading?: boolean;
  publication?: AnyPublication;
  url?: string;
}

const Oembed: FC<OembedProps> = ({
  className = '',
  openActionEmbed,
  openActionEmbedLoading,
  publication,
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
    nft: data?.nft,
    portal: data?.portal,
    site: data?.site,
    title: data?.title,
    url: url as string
  };

  if (!og.title && !og.html && !og.nft && !og.portal) {
    return null;
  }

  const targetPublication =
    publication && isMirrorPublication(publication)
      ? publication.mirrorOn
      : publication;

  // Check if the publication has an NFT minting open action module
  const canPerformDecentAction: boolean =
    !!targetPublication &&
    targetPublication.openActionModules.some(
      (module) =>
        module.contract.address === VerifiedOpenActionModules.DecentNFT
    );

  const embedDecentOpenAction: boolean =
    canPerformDecentAction || !!openActionEmbed;

  return (
    <div className={className}>
      {embedDecentOpenAction && !!publication ? (
        <DecentOpenAction
          og={og}
          openActionEmbed={!!openActionEmbed}
          openActionEmbedLoading={!!openActionEmbedLoading}
          publication={publication}
        />
      ) : og.html ? (
        <Player og={og} />
      ) : og.nft ? (
        <Nft nft={og.nft} publicationId={publication?.id} />
      ) : og.portal ? (
        <Portal portal={og.portal} publicationId={publication?.id} />
      ) : (
        <Embed og={og} publicationId={publication?.id} />
      )}
    </div>
  );
};

export default Oembed;