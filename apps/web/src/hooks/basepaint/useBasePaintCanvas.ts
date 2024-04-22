import { BASE_URL, HEY_API_URL, NFT_WORKER_URL } from '@lensshare/data/constants';
import type { BasePaintCanvas } from '@lensshare/types/nft';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseBasePaintCanvasProps {
  id: number;
  enabled?: boolean;
}

const useBasePaintCanvas = ({
  id,
  enabled
}: UseBasePaintCanvasProps): {
  data: BasePaintCanvas;
  loading: boolean;
  error: unknown;
} => {
  const getBasePaintCanvasMetadata = async () => {
    const response = await axios.get(`${BASE_URL}/api/nft/getBasePaintCanvas`, {
      params: { id }
    });

    return response.data?.canvas;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['getBasePaintCanvasMetadata', id],
    queryFn: getBasePaintCanvasMetadata,
    enabled
  });

  return { data, loading: isLoading, error };
};

export default useBasePaintCanvas;
