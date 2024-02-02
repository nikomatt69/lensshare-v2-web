import type { AnyPublication, Profile } from '@lensshare/lens';
import type { Metadata } from 'next';

import { APP_NAME, HANDLE_PREFIX } from '@lensshare/data/constants';
import { LimitType, ProfileDocument, PublicationType, PublicationsDocument } from '@lensshare/lens';
import { apolloClient } from '@lensshare/lens/apollo';
import getAvatar from '@lensshare/lib/getAvatar';
import getProfile from '@lensshare/lib/getProfile';
import logger from '@lensshare/lib/logger';
import { headers } from 'next/headers';
import React from 'react';
import defaultMetadata from 'src/app/defaultMetadata';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';
import getPublicationData from '@lensshare/lib/getPublicationData';

interface Props {
  params: { handle: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = params;
  const { data } = await apolloClient().query({
    query: ProfileDocument,
    variables: { request: { forHandle: `${HANDLE_PREFIX}${handle}` } }
  });

  if (!data.profile) {
    return defaultMetadata;
  }

  const profile = data.profile as Profile;
  const { displayName, link, slugWithPrefix } = getProfile(profile);
  const title = `${displayName} (${slugWithPrefix}) • ${APP_NAME}`;
  const description = (profile?.metadata?.bio || title).slice(0, 155);

  return {
    alternates: { canonical: `https://lenshareapp.xyz${link}` },
    applicationName: APP_NAME,
    creator: displayName,
    description: description,
    keywords: [
      'lensshare',
      'lenshareapp.xyz',
      'social media profile',
      'social media',
      'lenster',
      'user profile',
      'lens',
      'lens protocol',
      'decentralized',
      'web3',
      displayName,
      slugWithPrefix
    ],
    metadataBase: new URL(`https://lenshareapp.xyz${link}`),
    openGraph: {
      description: description,
      images: [getAvatar(profile)],
      siteName: 'LensShare',
      type: 'profile',
      url: `https://lenshareapp.xyz${link}`
    },
    other: { 'lens:id': profile.id },
    publisher: displayName,
    title: title,
    twitter: { card: 'summary'}
  };
}

export default async function Page({ params }: Props) {
  const metadata = await generateMetadata({ params });
  const { data } = await apolloClient().query({
    query: PublicationsDocument,
    variables: {
      request: {
        limit: LimitType.Fifty,
        where: {
          from: metadata.other?.['lens:id'],
          publicationTypes: [
            PublicationType.Post,
            PublicationType.Quote,
            PublicationType.Mirror
          ]
        }
      }
    }
  });

  if (!metadata) {
    return <h1>{params.handle}</h1>;
  }

  return (
    <>
      <h1>{metadata.title?.toString()}</h1>
      <h2>{metadata.description?.toString()}</h2>
      <div>
        <h3>Publications</h3>
        <ul>
          {data?.publications?.items?.map((publication: AnyPublication) => {
            const targetPublication = isMirrorPublication(publication)
              ? publication.mirrorOn
              : publication;
            const filteredContent =
              getPublicationData(targetPublication.metadata)?.content || '';

            return (
              <li key={publication.id}>
                <a href={`https://lenshareapp.xyz/posts/${publication.id}`}>
                  {filteredContent}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}