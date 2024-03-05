import Document, { Head, Html, Main, NextScript } from 'next/document';

class LensShareDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          {/* Prefetch and Preconnect */}
          <link rel="preconnect" href="https://static-assets.mycrumbs.xyz" />
          <link
            rel="dns-prefetch"
            href="https://static-assets.mycrumbs.xyz"
          />
          <link rel="preconnect" href="https://asset.mycrumbs.xyz" />
          <link rel="dns-prefetch" href="https://asset.mycrumbs.xyz" />
          <link rel="preconnect" href="https://prerender.mycrumbs.xyz" />
          <link rel="dns-prefetch" href="https://prerender.mycrumbs.xyz" />
          <link rel="preconnect" href="https://og.mycrumbs.xyz" />
          <link rel="dns-prefetch" href="https://og.mycrumbs.xyz" />
          {/* Misc */}
          <meta name="application-name" content="MyCrumbs" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="MyCrumbs" />

          {/* Icons */}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />

          <script src="https://unpkg.com/wavesurfer.js@7" />

          {/* PWA config */}

          <link
            rel="manifest"
            href="https://progressier.app/B5LgRYtk8D553Rd2UvFW/progressier.json"
          />

          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="MyCrumbs" />
          <link rel="icon" href="/images/icon.png" />
          <meta name="theme-color" content="#000" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default LensShareDocument;
