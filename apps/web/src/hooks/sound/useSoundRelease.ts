import { LENSSHARE_API_URL } from '@lensshare/data/constants';
import type { SoundRelease } from '@lensshare/types/nft';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseSoundReleaseProps {
  enabled?: boolean;
  handle: string;
  slug: string;
}

const useSoundRelease = ({
  enabled,
  handle,
  slug
}: UseSoundReleaseProps): {
  data: SoundRelease;
  error: unknown;
  loading: boolean;
} => {
  // TODO: make this type safe
  const getSoundReleaseDetails = async () => {
    const { data } = await axios.get(`/api/nft/release`, {
      params: { handle, slug }
    });

    return data?.release;
  };

  const { data, error, isLoading } = useQuery({
    enabled,
    queryFn: getSoundReleaseDetails,
    queryKey: ['getSoundReleaseDetails', handle, slug],
    refetchOnMount: false
  });

  return { data, error, loading: isLoading };
};

export default useSoundRelease;
