import { BASE_URL, HEY_API_URL, NFT_WORKER_URL } from '@lensshare/data/constants';
import type { UnlonelyChannel } from '@lensshare/types/nft';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseUnlonelyChannelProps {
  slug: string;
  enabled?: boolean;
}

const useUnlonelyChannel = ({
  slug,
  enabled
}: UseUnlonelyChannelProps): {
  data: UnlonelyChannel;
  loading: boolean;
  error: unknown;
} => {
  const getUnlonelyChannelDetails = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/nft/unlonely/getUnlonelyChannel`,
      { params: { slug } }
    );

    return response.data?.channel;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['getUnlonelyChannelDetails', slug],
    queryFn: getUnlonelyChannelDetails,
    enabled
  });

  return { data, loading: isLoading, error };
};

export default useUnlonelyChannel;
