import { APP_NAME, DESCRIPTION, IMAGE_OG } from '@lensshare/data/constants';
import Head from 'next/head';
import type { FC } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
}

const MetaTags: FC<MetaTagsProps> = ({
  title = APP_NAME,
  description = DESCRIPTION
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
      />
      <link href="https://mycrumbs.xyz" rel="canonical" />

      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={IMAGE_OG} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content={APP_NAME} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={IMAGE_OG} />
      <meta property="twitter:image:width" content="400" />
      <meta property="twitter:image:height" content="400" />
      <meta property="twitter:creator" content="@lenshareappxyz" />

      <link
        rel="search"
        type="application/opensearchdescription+xml"
        href="/opensearch.xml"
        title={APP_NAME}
      />

      {/* Prefetch and Preconnect */}
      <link rel="preconnect" href="https://static-assets.mycrumbs.xyz" />
      <link rel="dns-prefetch" href="https://static-assets.mycrumbs.xyz" />
      <link rel="preconnect" href="https://asset.mycrumbs.xyz" />
      <link rel="dns-prefetch" href="https://asset.mycrumbs.xyz" />
      <link rel="preconnect" href="https://prerender.mycrumbs.xyz" />
      <link rel="dns-prefetch" href="https://prerender.mycrumbs.xyz" />
      <link rel="preconnect" href="https://og.mycrumbs.xyz" />
      <link rel="dns-prefetch" href="https://og.mycrumbs.xyz" />

      {/* PWA config */}

      <link rel="manifest" href="/manifest.json" />

      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="MyCrumbs" />
      <link rel="icon" href="/images/icon.png" />
      <meta name="theme-color" content="#000" />
    </Head>
  );
};

export default MetaTags;
