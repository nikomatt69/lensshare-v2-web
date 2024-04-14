
import allowCors from '@utils/allowCors';
import createClickhouseClient from '@utils/createClickhouseClient';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    // Postgres

    // Clickhouse
    const clickhouse = createClickhouseClient();
    const rows = await clickhouse.query({
      format: 'JSONEachRow',
      query: 'SELECT count(*) from events;'
    });

    const result =
      await rows.json<Array<{ event_date: string; event_count: number }>>();

    const eventData = result.reduce((acc: any, { event_date, event_count }) => {
      acc[event_date] = Number(event_count);
      return acc;
    }, {});

    return res.status(200).json({ ping: 'pong' });
  } catch {
    return res.status(500).json({ success: false });
  }
};

export default handler;
