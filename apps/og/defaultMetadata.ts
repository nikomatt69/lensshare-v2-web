import { APP_NAME, DEFAULT_OG, DESCRIPTION } from '@lensshare/data/constants';
import type { Metadata } from 'next';

const defaultMetadata: Metadata = {
  alternates: { canonical: 'https://mycrumbs.xyz' },
  applicationName: APP_NAME,
  description: DESCRIPTION,
  keywords: [
    'lensshare',
    'mycrumbs.xyz',
    'social media',
    'lenster',
    'like',
    'share',
    'post',
    'comment',
    'publication',
    'lens',
    'lens protocol',
    'decentralized',
    'web3'
  ],
  metadataBase: new URL(`https://mycrumbs.xyz`),
  openGraph: {
    images: [DEFAULT_OG],
    siteName: 'MyCrumbs',
    type: 'website'
  },
  title: APP_NAME,
  twitter: { card: 'summary_large_image' }
};


export default defaultMetadata;
