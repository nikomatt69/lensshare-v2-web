import '../styles.css';
import Providers from '@components/Common/Providers';

import type { AppProps } from 'next/app';
import { Suspense } from 'react';
import Loading from '@components/Shared/Loading';
import { heyFont } from '@lib/heyFont';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <Providers>
        <style jsx global>{`
          body {
            font-family: ${heyFont.style.fontFamily};
          }
        `}</style>
        <Component {...pageProps} />
      </Providers>
    </Suspense>
  );
};

export default App;
