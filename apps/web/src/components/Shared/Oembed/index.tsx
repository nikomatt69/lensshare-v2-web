import type { OG } from '@lensshare/types/misc';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, type FC, useEffect } from 'react';

import Embed from './Embed';
import Player from './Player';
import getFavicon from 'src/utils/oembed/getFavicon';

import Nft from './Nft';
import type { AnyPublication } from '@lensshare/lens';
import Portal from './Portal';

import { VerifiedOpenActionModules } from '@lensshare/data/verified-openaction-modules';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import DecentOpenAction from '@components/Publication/LensOpenActions/UnknownModule/Decent 2';
import Frame from './Frame';
import PolymarketWidget from './PolymarketWidget';
import PolymarketOembed from './PolymarketOembed';

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
  const [currentPublication, setCurrentPublication] =
    useState<AnyPublication>();

  useEffect(() => {
    if (publication) {
      setCurrentPublication(publication);
    }
  }, [publication]);

  if (isLoading || error || !data) {
    return null;
  }

  const og: OG = {
    description: data?.description,
    favicon: getFavicon(data.url),
    html: data?.html,
    image: data?.image,
    frame:data?.frame,
    isLarge: data?.isLarge,
    polymarket:data?.polymarket,
    nft: data?.nft,
    portal: data?.portal,
    site: data?.site,
    title: data?.title,
    url: url as string
  };
  const targetPublication =
  currentPublication && isMirrorPublication(currentPublication)
  ? currentPublication.mirrorOn
  : currentPublication;

  const canPerformDecentAction: boolean =
  !!targetPublication &&
  targetPublication.openActionModules.some(
    (module) =>
      module.contract.address === VerifiedOpenActionModules.DecentNFT
  );

const embedDecentOpenAction: boolean =
  canPerformDecentAction || !!openActionEmbed;

  if (!og.title && !og.html && !og.nft && !embedDecentOpenAction) {
    return null;
  }

  return (
    <div className={className}>
       {embedDecentOpenAction ? (
        <DecentOpenAction
          og={og}
          openActionEmbed={!!openActionEmbed}
          openActionEmbedLoading={!!openActionEmbedLoading}
          publication={currentPublication}
        />
      ) : og.html ? (
        <Player og={og} />
      ) : og.nft ? (
        <Nft nft={og.nft} />
      ) : (
        <Embed og={og} publicationId={currentPublication?.id} />
      )}
    </div>
  );
};

export default Oembed;
