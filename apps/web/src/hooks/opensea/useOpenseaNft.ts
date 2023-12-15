import { OPENSEA_KEY } from '@lensshare/data/constants';
import type { OpenSeaNft } from '@lensshare/types/opensea-nft';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import urlcat from 'urlcat';

interface UseOpenseaNftProps {
  chain: number;
  address: string;
  token: string;
  enabled?: boolean;
}

const useOpenseaNft = ({
  chain,
  address,
  token,
  enabled
}: UseOpenseaNftProps): {
  data: OpenSeaNft;
  loading: boolean;
  error: unknown;
} => {
  const getOpenSeaChainName = () => {
    switch (chain) {
      case 1:
        return 'ethereum';
      case 5:
        return 'goerli';
      case 137:
        return 'matic';
      case 80001:
        return 'mumbai';
      default:
        return 'ethereum';
    }
  };

  const getOpenseaNftDetails = async () => {
    const response = await axios.get(
      urlcat(
        'https://api.opensea.io/v2/chains/:chain/contract/:address/nfts/:token',
        {
          chain: getOpenSeaChainName(),
          address,
          token,
          format: 'json'
        }
      ),
      { headers: { 'X-API-KEY': OPENSEA_KEY } }
    );

    return response.data?.nft;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['getOpenseaNftDetails', chain, address, token],
    queryFn: getOpenseaNftDetails,
    enabled
  });

  return { data, loading: isLoading, error };
};

export default useOpenseaNft;
