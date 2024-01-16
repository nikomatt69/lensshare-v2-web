import { APP_NAME, DEFAULT_OG, DESCRIPTION } from '@lensshare/data/constants';
import type { Metadata } from 'next';



const defaultMetadata: Metadata = {
  description: DESCRIPTION,
  metadataBase: new URL(`https://lenshareapp.xyz`),
  openGraph: {
    images: [DEFAULT_OG],
    siteName: 'LensShare',
    type: 'website'
  },
  title: APP_NAME,
  twitter: { card: 'summary_large_image' }
};

export default defaultMetadata;
