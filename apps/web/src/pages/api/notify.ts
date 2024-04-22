import type { NextApiRequest, NextApiResponse } from 'next';
import { getSubscriptionsByProfileId } from '../../utils/dbUtils';
import { sendNotification } from 'src/utils/webPushUtils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { profileId, title, message } = req.body;
    try {
      const subscriptions = await getSubscriptionsByProfileId(profileId);
      for (const subscription of subscriptions) {
        sendNotification(subscription, { title, message });
      }
      res.status(200).json({ message: 'Notifications sent' });
    } catch (error) {
      console.error('Notification send error:', error);
      res.status(500).json({ error: 'Failed to send notifications' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
