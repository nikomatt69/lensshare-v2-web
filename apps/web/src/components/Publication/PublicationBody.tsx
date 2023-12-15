import Attachments from '@components/Shared/Attachments';
import Quote from '@components/Shared/Embed/Quote';
import Markup from '@components/Shared/Markup';
import Oembed from '@components/Shared/Oembed';
import Video from '@components/Shared/Video';
import { EyeIcon } from '@heroicons/react/24/outline';
import type { AnyPublication } from '@lensshare/lens';
import getPublicationData from '@lensshare/lib/getPublicationData';
import getURLs from '@lensshare/lib/getURLs';
import isPublicationMetadataTypeAllowed from '@lensshare/lib/isPublicationMetadataTypeAllowed';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import removeUrlAtEnd from '@lensshare/lib/removeUrlAtEnd';
import type { OG } from '@lensshare/types/misc';
import cn from '@lensshare/ui/cn';
import Link from 'next/link';
import type { FC } from 'react';
import { memo, useState } from 'react';
import { isIOS, isMobile } from 'react-device-detect';

import EncryptedPublication from './EncryptedPublication';
import Embed from './HeyOpenActions/Embed';
import Nft from './HeyOpenActions/Nft';
import NotSupportedPublication from './NotSupportedPublication';
import getSnapshotProposalId from '@lib/getSnapshotProposalId';
import Snapshot from './HeyOpenActions/Snapshot';

interface PublicationBodyProps {
  publication: AnyPublication;
  showMore?: boolean;
  quoted?: boolean;
}

const PublicationBody: FC<PublicationBodyProps> = ({
  publication,
  showMore = false,
  quoted = false
}) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { id, metadata } = targetPublication;

  const filteredContent = getPublicationData(metadata)?.content || '';
  const filteredAttachments = getPublicationData(metadata)?.attachments || [];
  const filteredAsset = getPublicationData(metadata)?.asset;
  const canShowMore = filteredContent?.length > 450 && showMore;
  const urls = getURLs(filteredContent);
  const hasURLs = urls.length > 0;
  const snapshotProposalId = getSnapshotProposalId(urls);
  let rawContent = filteredContent;

  if (isIOS && isMobile && canShowMore) {
    const truncatedRawContent = rawContent?.split('\n')?.[0];
    if (truncatedRawContent) {
      rawContent = truncatedRawContent;
    }
  }

  const [content, setContent] = useState(rawContent);

  if (targetPublication.isEncrypted) {
    return <EncryptedPublication type={targetPublication.__typename} />;
  }

  if (!isPublicationMetadataTypeAllowed(metadata.__typename)) {
    return <NotSupportedPublication type={metadata.__typename} />;
  }

  // Show NFT if it's there
  const showNft = metadata.__typename === 'MintMetadataV3';
  const showSnapshot = snapshotProposalId;
  // Show live if it's there
  const showLive = metadata.__typename === 'LiveStreamMetadataV3';
  // Show embed if it's there
  const showEmbed = metadata.__typename === 'EmbedMetadataV3';
  // Show attachments if it's there
  const showAttachments = filteredAttachments.length > 0 || filteredAsset;
  // Show oembed if no NFT, no attachments, no snapshot, no quoted publication
  const showOembed =
    hasURLs &&
    !showNft &&
    !showLive &&
    !showSnapshot &&
    !showEmbed &&
    !showAttachments &&
    !quoted;

  // Remove URL at the end if oembed is there
  const onOembedData = (data: OG) => {
    if (showOembed && data?.title) {
      const updatedContent = removeUrlAtEnd(urls, content);
      if (updatedContent !== content) {
        setContent(updatedContent);
      }
    }
  };

  return (
    <div className="break-words">
      <Markup
        className={cn(
          { 'line-clamp-5': canShowMore },
          'markup linkify break-words text-xs'
        )}
        mentions={targetPublication.profilesMentioned}
      >
        {content}
      </Markup>
      {canShowMore ? (
        <div className="lt-text-gray-500 mt-4 flex items-center space-x-1 text-sm font-bold">
          <EyeIcon className="h-4 w-4" />
          <Link href={`/posts/${id}`}>Show more</Link>
        </div>
      ) : null}
      {/* Attachments and Quotes */}
      {showAttachments ? (
        <Attachments attachments={filteredAttachments} asset={filteredAsset} />
      ) : null}
      {/* Open actions */}
      {showEmbed ? <Embed embed={metadata.embed} /> : null}
      {showSnapshot ? <Snapshot proposalId={snapshotProposalId} /> : null}
      {showNft ? (
        <Nft mintLink={metadata.mintLink} publication={publication} />
      ) : null}
      {showLive ? (
        <div className="mt-3">
          <Video src={metadata.liveURL || metadata.playbackURL} />
        </div>
      ) : null}
      {showOembed ? (
        <Oembed
          url={urls[0]}
          publicationId={publication.id}
          onData={onOembedData}
        />
      ) : null}
      {targetPublication.__typename === 'Quote' && (
        <Quote publication={targetPublication.quoteOn} />
      )}
    </div>
  );
};

export default memo(PublicationBody);

