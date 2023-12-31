import { createClient } from '@clickhouse/client';

import { CLICKHOUSE_URL } from './constants';

const createClickhouseClient = () => {
  const NEXT_PUBLIC_CLICKHOUSE_PASSWORD = 'gieK~6F9vTWnG';
  return createClient({
    host: CLICKHOUSE_URL,
    database: 'default',
    password: NEXT_PUBLIC_CLICKHOUSE_PASSWORD
  });
};

export default createClickhouseClient;
