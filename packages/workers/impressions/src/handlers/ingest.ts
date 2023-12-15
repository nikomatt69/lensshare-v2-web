
import { Errors } from '@lensshare/data/errors';
import response from '@lensshare/lib/response';
import { array, object, string } from 'zod';
import createClickhouseClient from '@lensshare/clickhouse/createClickhouseClient'
import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  viewer_id: string;
  ids: string[];
};

const validationSchema = object({
  viewer_id: string(),
  ids: array(string())
});

export default async (request: WorkerRequest) => {
  const body = await request.json();
  if (!body) {
    return response({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return response({ success: false, error: validation.error.issues });
  }
  const NEXT_PUBLIC_CLICKHOUSE_PASSWORD = 'gieK~6F9vTWnG';
  const { viewer_id, ids } = body as ExtensionRequest;
  try {
    const values = ids.map((id) => ({
      viewer_id,
      publication_id: id
    }));

    const client = createClickhouseClient(request.env.CLICKHOUSE_PASSWORD);
    const result = await client.insert({
      table: 'impressions',
      values,
      format: 'JSONEachRow'
    });


    return response({ success: true, id: result.query_id });
  } catch (error) {
    throw error;
  }
};
