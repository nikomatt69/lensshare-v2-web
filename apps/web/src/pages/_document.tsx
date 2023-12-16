import Document, { Head, Html, Main, NextScript } from 'next/document';

class LensShareDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          {/* Prefetch and Preconnect */}
          <link rel="preconnect" href="https://static-assets.lenshareapp.xyz" />
          <link
            rel="dns-prefetch"
            href="https://static-assets.lenshareapp.xyz"
          />
          <link rel="preconnect" href="https://asset.lenshareapp.xyz" />
          <link rel="dns-prefetch" href="https://asset.lenshareapp.xyz" />

          {/* Misc */}
          <meta name="application-name" content="LensShare" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="LensShare" />

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

          {/* PWA config */}

          <link
            rel="manifest"
            href="https://progressier.app/n3shfjBJt3OOEInGTpqa/progressier.json"
          />
          <script
            defer
            src="https://progressier.app/n3shfjBJt3OOEInGTpqa/script.js"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="LensShare" />
          <link rel="icon" href="/images/icon.png" />
          <meta name="theme-color" content="#ffffff" />
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
