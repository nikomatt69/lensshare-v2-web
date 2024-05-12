import { HttpLink } from '@apollo/client';
import { API_URL, APP_NAME } from '@lensshare/data/constants';

const httpLink = new HttpLink({
  uri: API_URL,
  fetchOptions: 'no-cors',
  fetch,
  headers: {
    'x-requested-from': APP_NAME.toLowerCase()
  },
});

export default httpLink;
