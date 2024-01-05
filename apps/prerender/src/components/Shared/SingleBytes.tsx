import type { AnyPublication } from '@lensshare/lens';
import getAvatar from '@lensshare/lib/getAvatar';
import getProfile from '@lensshare/lib/getProfile';
import getPublicationData from '@lensshare/lib/getPublicationData';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import truncateByWords from '@lensshare/lib/truncateByWords';
import type { FC } from 'react';
import { BASE_URL } from 'src/constants';

interface PublicationProps {
  publication: AnyPublication;
  h1Content?: boolean;
}

const SingleBytes: FC<PublicationProps> = ({
  publication,
  h1Content = false
}) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { stats, metadata } = targetPublication;

  const filteredContent = getPublicationData(metadata)?.content || '';
  const filteredAttachments = getPublicationData(metadata)?.attachments || [];
  const filteredAsset = getPublicationData(metadata)?.asset;

  const media =
    filteredAsset?.uri || filteredAsset?.cover || filteredAttachments[0]?.uri;
  const mediaType = filteredAsset?.type || filteredAttachments[0]?.type;
  const isVideo = mediaType === 'Video';
  const profile = targetPublication.by;
  const publicationId = targetPublication.id;
  const avatar = getAvatar(profile);
  const attachment = media ? sanitizeDStorageUrl(media) : null;
  const content = truncateByWords(filteredContent, 30);

  // Stats
  const commentsCount = stats.comments;
  const likesCount = stats.reactions;
  const mirrorsCount = stats.mirrors;

  return (
    <>
      <div>
        <a href={`${BASE_URL}${getProfile(profile).link}`}>
          <img
            alt={`${getProfile(profile).slugWithPrefix}'s avatar`}
            src={avatar}
            width="64"
          />
        </a>
      </div>
      <div>
        <div>
          <a href={`${BASE_URL}${getProfile(profile).link}`}>
            {getProfile(profile).displayName}
          </a>
        </div>
        <div>
          <a href={`${BASE_URL}${getProfile(profile).link}`}>
            {getProfile(profile).slugWithPrefix}
          </a>
        </div>
        {h1Content ? (
          <h1>
            <a href={`${BASE_URL}/bytes/${publicationId}`}>{content ?? ''}</a>
          </h1>
        ) : (
          <div>
            <a href={`${BASE_URL}/bytes/${publicationId}`}>{content ?? ''}</a>
          </div>
        )}
        {attachment ? (
          isVideo ? (
            <video src={attachment} />
          ) : (
            <img alt="attachment" src={attachment} width="500" />
          )
        ) : null}
      </div>
      <div>
        <div>{commentsCount} Comments</div>
        <div>{likesCount} Likes</div>
        <div>{mirrorsCount} Mirrors</div>
        <hr />
      </div>
    </>
  );
};

export default SingleBytes;
