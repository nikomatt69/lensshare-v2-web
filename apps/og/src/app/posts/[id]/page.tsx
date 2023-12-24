import type { AnyPublication } from '@lensshare/lens';
import type { Metadata } from 'next';

import { APP_NAME } from '@lensshare/data/constants';
import { PublicationDocument } from '@lensshare/lens';
import { apolloClient } from '@lensshare/lens/apollo';
import getAvatar from '@lensshare/lib/getAvatar';
import getProfile from '@lensshare/lib/getProfile';
import logger from '@lensshare/lib/logger';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import { headers } from 'next/headers';
import React from 'react';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const headersList = headers();
  const agent = headersList.get('user-agent');
  logger.info(`OG request from ${agent} for Publication:${params.id}`);

  const { id } = params;
  const { data } = await apolloClient().query({
    query: PublicationDocument,
    variables: { request: { forId: id } }
  });

  if (!data.publication) {
    return {
      title: 'Publication not found'
    };
  }

  const publication = data.publication as AnyPublication;
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const profile = targetPublication.by;

  const title = `${targetPublication.__typename} by ${
    getProfile(profile).slugWithPrefix
  } • ${APP_NAME}`;

  return {
    description: profile?.metadata?.bio,
    metadataBase: new URL(
      `https://lenshareapp.xyz/posts/${targetPublication.id}`
    ),
    openGraph: {
      images: [getAvatar(profile)],
      siteName: 'LensShare',
      type: 'article'
    },
    title: title,
    twitter: {
      card: 'summary'
    }
  };
}

export default function Page({ params }: Props) {
  return <div>{params.id}</div>;
}
