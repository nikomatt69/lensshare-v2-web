import type { ApolloLink } from '@apollo/client';
import { ApolloClient, from } from '@apollo/client';

import cache from './cache';
import httpLink from './httpLink';
import retryLink from './retryLink';
import superfluidLink from './superfluidLink';

const apolloClient = (authLink?: ApolloLink) =>
  new ApolloClient({
    link: authLink
      ? from([authLink, retryLink, httpLink, superfluidLink])
      : from([retryLink, httpLink, superfluidLink]),
    cache
  });

export default apolloClient;
