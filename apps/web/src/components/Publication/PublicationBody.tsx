/* eslint-disable react/jsx-no-undef */
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
import cn from '@lensshare/ui/cn';
import Link from 'next/link';
import type { FC } from 'react';
import { memo } from 'react';


import getPublicationAttribute from '@lensshare/lib/getPublicationAttribute';
import { isIOS, isMobile } from 'react-device-detect';
import Snapshot from './HeyOpenActions/Snapshot';
import NotSupportedPublication from './NotSupportedPublication';
import getSnapshotProposalId from '@lib/getSnapshotProposalId';
import EncryptedPublication from './EncryptedPublication';
import { CardBody, CardContainer } from '@lensshare/ui/src/3DCard';
import Embed from './HeyOpenActions/Embed';
import Nft from './HeyOpenActions/Nft';
interface PublicationBodyProps {
  contentClassName?: string;
  publication: AnyPublication;
  quoted?: boolean;
  showMore?: boolean;
}

const PublicationBody: FC<PublicationBodyProps> = ({
  contentClassName = '',
  publication,
  quoted = false,
  showMore = false
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
  let content = filteredContent;

  if (isIOS && isMobile && canShowMore) {
    const truncatedContent = content?.split('\n')?.[0];
    if (truncatedContent) {
      content = truncatedContent;
    }
  }

  if (targetPublication.isEncrypted) {
    return <EncryptedPublication publication={targetPublication} />;
  }

  if (!isPublicationMetadataTypeAllowed(metadata?.__typename)) {
    return <NotSupportedPublication type={metadata?.__typename} />;
  }

  const showNft = metadata.__typename === 'MintMetadataV3';
  const showEmbed = metadata.__typename === 'EmbedMetadataV3';
  // Show live if it's there
  const showLive = metadata?.__typename === 'LiveStreamMetadataV3';
  // Show attachments if it's there
  const showAttachments = filteredAttachments.length > 0 || filteredAsset;
  const showSnapshot = snapshotProposalId;

  const showPoll = (snapshotProposalId);
  // Show live if it's there
  const showSharingLink = metadata?.__typename === 'LinkMetadataV3';
  // Show oembed if no NFT, no attachments, no quoted publication
  const showOembed =
    !showSharingLink &&
    hasURLs &&
    !showNft &&
    !showLive &&
    !showSnapshot &&
    !showEmbed &&
    !showAttachments &&
    !quoted;

  return (
    <div className="break-words">
      <Markup
        className={cn(
          { 'line-clamp-5': canShowMore },
          'markup linkify break-words text-xs',
          contentClassName
        )}
        mentions={targetPublication.profilesMentioned}
      >
        {content}
      </Markup>
      {canShowMore ? (
        <div className="ld-text-gray-500 mt-4 flex items-center space-x-1 text-sm font-bold">
          <EyeIcon className="h-4 w-4" />
          <Link href={`/posts/${id}`}>Show more</Link>
        </div>
      ) : null}
      <CardContainer className="w-max-fit">
        <CardBody className="group/card relative   rounded-xl  border-black/[0.1]   dark:border-white/[0.2]  dark:hover:shadow-emerald-500/[0.1]   ">
          {/* Attachments and Quotes */}
          {showAttachments ? (
            <Attachments
              publication={publication}
              asset={filteredAsset}
              attachments={filteredAttachments}
            />
          ) : null}
          {showSnapshot ? <Snapshot proposalId={snapshotProposalId} /> : null}
         {showNft ? (
            <Nft url={metadata.mintLink} publication={publication.id} />
          ) : null}
          {showLive ? (
            <div className="mt-3">
              <Video src={metadata.liveURL || metadata.playbackURL} />
            </div>
          ) : null}
          {showEmbed ? <Embed embed={metadata?.embed} /> : null}
          {showOembed ? (
            <Oembed publication={publication} url={urls[0]} />
          ) : null}
          {showSharingLink ? (
            <Oembed publication={publication} url={metadata.sharingLink} />
          ) : null}
          {targetPublication?.__typename === 'Quote' && (
            <Quote publication={targetPublication.quoteOn} />
          )}
        </CardBody>
      </CardContainer>
    </div>
  );
};

export default memo(PublicationBody);
