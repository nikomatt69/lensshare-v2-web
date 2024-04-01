import { createClient } from '@clickhouse/client';

const createClickhouseClient = (username?: string, password?: string) => {
  password = password || 'y0Ym7Ni07T.55';
  username = username || 'default';

  return createClient({
    database: 'default',
    host: 'https://vgc59dcvih.eu-west-2.aws.clickhouse.cloud:8443',
    password,
    username
  });
};

export default createClickhouseClient;
