import type { FC } from 'react';

import Oembed from '@components/Shared/Oembed';
import getURLs from '@lensshare/lib/getURLs';
import getNft from '@lensshare/lib/nft/getNft';
import { usePublicationStore } from 'src/store/usePublicationStore';
import Nft from '@components/Publication/HeyOpenActions/Nft';
import { ZERO_PUBLICATION_ID } from '@lensshare/data/constants';
import type { AnyPublication, MirrorablePublication, Post } from '@lensshare/lens';

interface LinkPreviewProps {
  openActionEmbed: boolean;
  openActionEmbedLoading: boolean;
}

const LinkPreviews: FC<LinkPreviewProps> = ({
  openActionEmbed,
  openActionEmbedLoading
}) => {
  const publicationContent = usePublicationStore(
    (state) => state.publicationContent
  );

  const urls = getURLs(publicationContent);

  if (!urls.length) {
    return null;
  }

  const nft = getNft(urls);

  if (nft) {
    return (
      <div className="m-5">
        {nft ? (
          <Nft
            publication={ZERO_PUBLICATION_ID as unknown as AnyPublication}
            mintLink={nft.mintLink}
          />
        ) : (
          <Oembed url={urls[0]} />
        )}
      </div>
    );
  }

return (
    <Oembed
      className="m-5"
      openActionEmbed={openActionEmbed}
      openActionEmbedLoading={openActionEmbedLoading}
      url={urls[0]}
    />
  );
;
};

export default LinkPreviews;
