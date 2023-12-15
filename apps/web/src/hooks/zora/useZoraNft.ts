import { BASE_URL, HEY_API_URL, NFT_WORKER_URL } from '@lensshare/data/constants';
import type { ZoraNft } from '@lensshare/types/nft';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseZoraNftProps {
  chain: string;
  address: string;
  token: string;
  enabled?: boolean;
}

const useZoraNft = ({
  chain,
  address,
  token,
  enabled
}: UseZoraNftProps): {
  data: ZoraNft;
  loading: boolean;
  error: unknown;
} => {
  const getZoraNftDetails = async () => {
    const response = await axios.get(`${BASE_URL}/api/nft/getZoraNft`, {
      params: { chain, address, token }
    });

    return response.data?.nft;
  };


  const { data, isLoading, error } = useQuery({
    queryKey: ['getZoraNftDetails', chain, address, token],
    queryFn: getZoraNftDetails,
    enabled
  });

  return { data, loading: isLoading, error };
};

export default useZoraNft;
