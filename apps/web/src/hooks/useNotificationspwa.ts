import { useQuery } from '@tanstack/react-query';
import { client } from '../lib/graphqlClient';
import { GET_NOTIFICATIONS_QUERY } from '../graphql/queries';

export function useNotifications(profileId) {
    return useQuery({
        queryKey: ['notifications', profileId],
        queryFn: async () => {
            const { notifications } = await client.request(GET_NOTIFICATIONS_QUERY, { profileId });
            return notifications.items;
        },
        staleTime: 5000, // Stale while revalidate
        cacheTime: 10000,
        enabled: !!profileId
    });
}