import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { subscription } = req.body;
    try {
        console.log('Subscription received:', subscription);
        res.status(200).json({ message: 'Subscription saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save subscription' });
    }
};