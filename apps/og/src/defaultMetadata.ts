import { APP_NAME, DEFAULT_OG, DESCRIPTION, IMAGE_OG } from '@lensshare/data/constants';
import type { Metadata } from 'next';

const defaultMetadata: Metadata = {
  description: DESCRIPTION,
  metadataBase: new URL(`https://mycrumbs.xyz`),
  openGraph: {
    images: [IMAGE_OG],
    siteName: 'MyCrumbs',
    type: 'website'
  },
  title: APP_NAME,
  twitter: { card: 'summary_large_image' }
};
export default defaultMetadata;
