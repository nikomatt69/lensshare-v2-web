import type { ApolloLink } from '@apollo/client';
import { ApolloClient, from, split } from '@apollo/client';
import superfluidLink from './superfluidLink';
import cache from './cache';
import httpLink from './httpLink';
import retryLink from './retryLink';
import wsLink from './wsLink';

import { ApolloClient, from, split, ApolloLink, HttpLink } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { RetryLink } from '@apollo/client/link/retry';
import superfluidLink from './superfluidLink';
import cache from './cache';

// HTTP and WebSocket links, adjust these imports according to your actual setup


// Retry Link configuration

// CSRF prevention link
const csrfLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'x-apollo-operation-name': operation.operationName || "UnknownOperation",
      'apollo-require-preflight': 'true'
    }
  }));
  return forward(operation);
});

// Combine links for HTTP and WebSocket based on the operation type
const requestLink = split(
  ({ query }) => {
    const { kind, operation } = query.definitions[0];
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink, // used if the above condition returns true
  from([csrfLink, httpLink]) // used if the condition returns false, CSRF link included
);

// Function to create Apollo Client instance
const apolloClient = (authLink?: ApolloLink) => {
  const link = authLink
    ? from([authLink, csrfLink, retryLink, requestLink, superfluidLink])
    : from([csrfLink, retryLink, requestLink, superfluidLink]);

  return new ApolloClient({
    connectToDevTools: true,
    link,
    cache
  });
};

export default apolloClient;
