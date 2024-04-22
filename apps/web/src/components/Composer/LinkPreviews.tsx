import type { FC } from 'react';

import Oembed from '@components/Shared/Oembed';
import getURLs from '@lensshare/lib/getURLs';
import getNft from '@lensshare/lib/nft/getNft';


import { ZERO_PUBLICATION_ID } from '@lensshare/data/constants';
import type { AnyPublication, MirrorablePublication, Post } from '@lensshare/lens';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';

interface LinkPreviewProps {
  openActionEmbed: boolean;
  openActionEmbedLoading: boolean;
}

const LinkPreviews: FC<LinkPreviewProps> = ({
  openActionEmbed,
  openActionEmbedLoading
}) => {
  const { publicationContent } = usePublicationStore();

  const urls = getURLs(publicationContent);

  if (!urls.length) {
    return null;
  }


  return (
    <Oembed
      className="m-5"
      openActionEmbed={openActionEmbed}
      openActionEmbedLoading={openActionEmbedLoading}
      url={urls[0]}
    />
  );
};

export default LinkPreviews;
