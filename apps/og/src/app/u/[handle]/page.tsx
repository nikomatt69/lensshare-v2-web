import type { Profile } from '@lensshare/lens';
import type { Metadata } from 'next';

import { APP_NAME, HANDLE_PREFIX } from '@lensshare/data/constants';
import { ProfileDocument } from '@lensshare/lens';
import { apolloClient } from '@lensshare/lens/apollo';
import getAvatar from '@lensshare/lib/getAvatar';
import getProfile from '@lensshare/lib/getProfile';
import logger from '@lensshare/lib/logger';
import { headers } from 'next/headers';
import React from 'react';

type Props = {
  params: { handle: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const headersList = headers();
  const agent = headersList.get('user-agent');
  logger.info(`OG request from ${agent} for Handle:${params.handle}`);

  const { handle } = params;
  const { data } = await apolloClient().query({
    query: ProfileDocument,
    variables: { request: { forHandle: `${HANDLE_PREFIX}${handle}` } }
  });

  if (!data.profile) {
    return {
      title: 'Profile not found'
    };
  }

  const profile = data.profile as Profile;

  const title = `${getProfile(profile).displayName} (${
    getProfile(profile).slugWithPrefix
  }) • ${APP_NAME}`;

  return {
    description: profile?.metadata?.bio,
    metadataBase: new URL(`https://lenshareapp.xyz/u/${profile.handle}`),
    openGraph: {
      images: [getAvatar(profile)],
      siteName: 'LensShare',
      type: 'profile'
    },
    title: title,
    twitter: {
      card: 'summary'
    }
  };
}

export default function Page({ params }: Props) {
  return <div>{params.handle}</div>;
}
