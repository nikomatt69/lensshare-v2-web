import { Errors } from '@lensshare/data/errors';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'src/utils/allowCors';
import { CACHE_AGE } from 'src/utils/constants';
import createClickhouseClient from 'src/utils/createClickhouseClient';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createClickhouseClient();
    const rows = await client.query({
      query: `
        WITH toYear(now()) AS current_year
        SELECT
          day,
          impressions,
          totalImpressions
        FROM (
          SELECT
            toDayOfYear(viewed_at) AS day,
            count() AS impressions
          FROM impressions
          WHERE splitByString('-', publication_id)[1] = '${id}'
            AND toYear(viewed_at) = current_year
          GROUP BY day
        ) AS dailyImpressions
        CROSS JOIN (
          SELECT count() AS totalImpressions
          FROM impressions
          WHERE splitByString('-', publication_id)[1] = '${id}'
            AND toYear(viewed_at) = current_year
        ) AS total
        ORDER BY day
      `,
      format: 'JSONEachRow'
    });

    const result =
      await rows.json<
        Array<{ day: number; impressions: number; totalImpressions: number }>
      >();

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({
        success: true,
        totalImpressions: Number(result[0].totalImpressions),
        yearlyImpressions: result.map((row) => ({
          day: row.day,
          impressions: Number(row.impressions)
        }))
      });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
