/* eslint-disable react-hooks/rules-of-hooks */
import { apolloClient, ApolloProvider } from '@lensshare/lens/apollo';
import authLink from '@lib/authLink';
import { Analytics } from '@vercel/analytics/react';
import getLivepeerTheme from '@lib/getLivepeerTheme';
import {
  createReactClient,
  LivepeerConfig,
  studioProvider
} from '@livepeer/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { ReactNode } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import Layout from '../Layout';
import LensSubscriptionsProvider from './LensSubscriptionsProvider';
import Web3Provider from './Web3Provider';
import { BASE_URL } from '@lensshare/data/constants';
import SW from '@components/ServiceWorker';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ThemeProvider from './ThemeProvider';

import HydrationZustand from './HydrationZustand';
import FeaturedGroupsProvider from './FeaturedGroupsProvider';
import PreferencesProvider from './PreferencesProvider';

const lensApolloClient = apolloClient(authLink);
const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: '9e17a7ab-3370-4e31-85c3-43072da2315e' || '',
    baseUrl: BASE_URL
  })
});
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
});

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <SW />
      <Web3Provider>
        <ApolloProvider client={lensApolloClient}>
          <LensSubscriptionsProvider />
          <QueryClientProvider client={queryClient}>
            <LivepeerConfig client={livepeerClient} theme={getLivepeerTheme}>
              <ThemeProvider>
                <HydrationZustand>
                  <Layout>{children}</Layout>
                </HydrationZustand>
              </ThemeProvider>
              <SpeedInsights />
              <Analytics />
            </LivepeerConfig>
          </QueryClientProvider>
        </ApolloProvider>
      </Web3Provider>
    </ErrorBoundary>
  );
};

export default Providers;
