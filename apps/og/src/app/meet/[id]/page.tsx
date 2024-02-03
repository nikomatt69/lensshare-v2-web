import type { AnyPublication } from '@lensshare/lens';
import type { Metadata } from 'next';

import { APP_NAME } from '@lensshare/data/constants';
import {
  LimitType,
  PublicationDocument,
  PublicationsDocument
} from '@lensshare/lens';
import { apolloClient } from '@lensshare/lens/apollo';
import getPublicationData from '@lensshare/lib/getPublicationData';
import getProfile from '@lensshare/lib/getProfile';
import { isMirrorPublication } from '@lensshare/lib/publicationHelpers';

import getCollectModuleMetadata from '@lib/getCollect';
import getPublicationOGImages from '@lib/getPublication';
import defaultMetadata from 'defaultMetadata';


interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const { data } = await apolloClient().query({
    query: PublicationDocument,
    variables: { request: { forId: id } }
  });

  if (!data.publication) {
    return defaultMetadata;
  }

  const publication = data.publication as AnyPublication;
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { by: profile, metadata } = targetPublication;
  const filteredContent = getPublicationData(metadata)?.content || '';
  const filteredAsset = getPublicationData(metadata)?.asset;
  const assetIsAudio = filteredAsset?.type === 'Audio';

  const { displayName, link, slugWithPrefix } = getProfile(profile);
  const title = `${targetPublication.__typename} by ${slugWithPrefix} • ${APP_NAME}`;
  const description = (filteredContent || title).slice(0, 155);

  return {
    alternates: {
      canonical: `https://lenshareapp.xyz/meet/${targetPublication.id}`
    },
    applicationName: APP_NAME,
    authors: {
      name: displayName,
      url: `https://lenshareapp.xyz${link}`
    },
    creator: displayName,
    description: description,
    keywords: [

      'social media post',
      'social media',
      'lenster',
      'user post',
      'like',
      'share',
      'post',
      'publication',
      'lens',
      'lens protocol',
      'decentralized',
      'web3',
      displayName,
      slugWithPrefix
    ],
    metadataBase: new URL(
      `https://lenshareapp.xyz/meet/${targetPublication.id}`
    ),
    openGraph: {
      description: description,
      images: getPublicationOGImages(metadata) as any,
      siteName: 'LensShare',
      type: 'article',
      url: `https://lenshareapp.xyz/meet/${targetPublication.id}`
    },
    other: {
      'count:actions': targetPublication.stats.countOpenActions,
      'count:comments': targetPublication.stats.comments,
      'count:likes': targetPublication.stats.reactions,
      'count:mirrors': targetPublication.stats.mirrors,
      'count:quotes': targetPublication.stats.quotes,
      'lens:id': targetPublication.id,
      ...getCollectModuleMetadata(targetPublication)
    },
    publisher: displayName,
    title: title,
    twitter: {
      card: assetIsAudio ? 'summary' : 'summary_large_image',
      
    }
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
          commentOn: {
            id: metadata.other?.['lens:id'],
            ranking: { filter: 'RELEVANT' }
          }
        }
      }
    }
  });

  if (!metadata) {
    return <h1>{params.id}</h1>;
  }

  return (
    <>
      <h1>{metadata.title?.toString()}</h1>
      <h2>{metadata.description?.toString()}</h2>
      <div>
        <b>Stats</b>
        <ul>
          <li>Actions: {metadata.other?.['count:actions']}</li>
          <li>Comments: {metadata.other?.['count:comments']}</li>
          <li>Likes: {metadata.other?.['count:likes']}</li>
          <li>Mirrors: {metadata.other?.['count:mirrors']}</li>
          <li>Quotes: {metadata.other?.['count:quotes']}</li>
        </ul>
      </div>
      <div>
        <h3>Comments</h3>
        <ul>
          {data?.publications?.items?.map((publication: AnyPublication) => {
            const targetPublication = isMirrorPublication(publication)
              ? publication.mirrorOn
              : publication;
            const filteredContent =
              getPublicationData(targetPublication.metadata)?.content || '';

            return (
              <li key={publication.id}>
                <a href={`https://lenshareapp.xyz/meet/${publication.id}`}>
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
