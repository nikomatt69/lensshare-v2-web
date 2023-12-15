import { APP_NAME, DEFAULT_OG } from '@lensshare/data/constants';
import type { AnyPublication, Comment } from '@lensshare/lens';
import getAvatar from '@lensshare/lib/getAvatar';
import getProfile from '@lensshare/lib/getProfile';
import getPublicationData from '@lensshare/lib/getPublicationData';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl';
import truncateByWords from '@lensshare/lib/truncateByWords';
import type { FC } from 'react';
import { BASE_URL } from 'src/constants';

import DefaultTags from './Shared/DefaultTags';
import SinglePublication from './Shared/SinglePublication';
import Tags from './Shared/Tags';

interface PublicationProps {
  publication: AnyPublication;
  comments: Comment[];
}

const Publication: FC<PublicationProps> = ({ publication, comments }) => {
  if (!publication) {
    return <DefaultTags />;
  }

  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;

  const { metadata } = targetPublication;

  const filteredContent = getPublicationData(metadata)?.content || '';
  const filteredAttachments = getPublicationData(metadata)?.attachments || [];
  const filteredAsset = getPublicationData(metadata)?.asset;

  const media =
    filteredAsset?.uri || filteredAsset?.cover || filteredAttachments[0]?.uri;
  const profile = targetPublication.by;
  const title = `${targetPublication.__typename} by ${
    getProfile(publication.by).slugWithPrefix
  } • ${APP_NAME}`;
  const description = truncateByWords(filteredContent, 30);
  const image = media
    ? sanitizeDStorageUrl(media)
    : profile
    ? getAvatar(profile)
    : DEFAULT_OG;

  return (
    <>
      <Tags
        title={title}
        description={description}
        image={image}
        publishedTime={publication?.createdAt}
        cardType={media ? 'summary_large_image' : 'summary'}
        url={`${BASE_URL}/posts/${publication.id}`}
      />
      <header>
        <SinglePublication publication={publication} h1Content />
      </header>
      <div>
        {comments?.map((comment) => {
          const { id } = comment;
          return (
            <div key={id}>
              <SinglePublication publication={comment} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Publication;
