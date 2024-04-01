import { createClient } from '@clickhouse/client';

import { CLICKHOUSE_URL } from './constants';

const createClickhouseClient = () => {
  const NEXT_PUBLIC_CLICKHOUSE_PASSWORD = 'y0Ym7Ni07T.55';
  return createClient({
    host: CLICKHOUSE_URL,
    database: 'default',
    password: NEXT_PUBLIC_CLICKHOUSE_PASSWORD
  });
};

export default createClickhouseClient;
