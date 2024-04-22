import type { NextApiRequest, NextApiResponse } from 'next';
import { saveSubscription } from 'src/utils/dbUtils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { subscription, profileId } = req.body;
    try {
      await saveSubscription({ subscription, profileId });
      res.status(200).json({ message: 'Subscription saved' });
    } catch (error) {
      console.error('Subscription save error:', error);
      res.status(500).json({ error: 'Failed to save subscription' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
