import { Errors } from '@lensshare/data/errors';
import logger from '@lensshare/lib/logger';
import { XMLBuilder } from 'fast-xml-parser';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'src/utils/allowCors';
import { CACHE_AGE, SWR_CACHE_AGE_1_MIN_30_DAYS } from 'src/utils/constants';

export const config = {
  api: { responseLimit: '8mb' }
};

interface Url {
  changefreq: string;
  loc: string;
  priority: string;
}

const buildSitemapXml = (url: Url[]): string => {
  const builder = new XMLBuilder({
    format: true,
    ignoreAttributes: false,
    processEntities: true,
    suppressEmptyNode: true
  });

  return builder.build({
    urlset: { '@_xmlns': 'https://www.sitemaps.org/schemas/sitemap/0.9', url }
  });
};
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const range = 'A1:B50000';
    const apiKey = process.env.GOOGLE_API_KEY;

    const sheetsResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}?key=${apiKey}`
    );

    const json: {
      values: string[][];
    } = await sheetsResponse.json();
    const handles = json.values.map((row) => row[0]);
    const entries: Url[] = handles.map((handle) => ({
      changefreq: 'weekly',
      loc: `https://mycrumbs.xyz/u/${handle}`,
      priority: '1.0'
    }));

    const xml = buildSitemapXml(entries);
    logger.info('Sitemap fetched from Google Sheets');

    return res
      .status(200)
      .setHeader('Content-Type', 'text/xml')
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .send(xml);
  } catch (error) {
    return ( error);
  }
};