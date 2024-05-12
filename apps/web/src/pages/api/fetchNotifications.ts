import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const LENS_API_ENDPOINT = 'https://api.lens.dev/notifications';

async function fetchNotifications(profileId: string, token: string): Promise<any> {
    const url = `${LENS_API_ENDPOINT}/${profileId}`;
    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { profileId, token } = req.body;
    try {
        const notifications = await fetchNotifications(profileId, token);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};
