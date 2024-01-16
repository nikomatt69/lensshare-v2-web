import type { ApolloLink } from '@apollo/client';
import { ApolloClient, from, split } from '@apollo/client';
import superfluidLink from './superfluidLink';
import cache from './cache';
import httpLink from './httpLink';
import retryLink from './retryLink';
import wsLink from './wsLink';

const requestLink = split(
  ({ query }) => {
    const { kind, operation } = query.definitions[0] as any;
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const apolloClient = (authLink?: ApolloLink) =>
  new ApolloClient({
    connectToDevTools: true,
    link: authLink
      ? from([authLink, retryLink, requestLink, httpLink, superfluidLink])
      : from([retryLink, httpLink,superfluidLink]),
    cache
  });

export default apolloClient;
