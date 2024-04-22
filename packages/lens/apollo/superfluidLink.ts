import { HttpLink } from '@apollo/client';
import { SUPERFLUID_SUBGRAPH } from '@lensshare/data/constants';

const superfluidLink = new HttpLink({
  uri: SUPERFLUID_SUBGRAPH,
  fetchOptions: 'no-cors',
  fetch
});

export default superfluidLink;
