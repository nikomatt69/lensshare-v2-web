import { BASE_URL, PRO_WORKER_URL } from '@lensshare/data/constants';
import getCurrentSession from '@lib/getCurrentSession';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useProStore } from 'src/store/useProStore';
import { isAddress } from 'viem';

const ProProvider: FC = () => {
  const { id: sessionProfileId } = getCurrentSession();
  const setIsPro = useProStore((state) => state.setIsPro);
  const setLoadingPro = useProStore((state) => state.setLoadingPro);

  const fetchProEnabled = async () => {
    try {
      if (
        Boolean(sessionProfileId) &&
        !isAddress(sessionProfileId)
      ) {
        const response = await axios.get(`${PRO_WORKER_URL}/getProEnabled`, {
          params: { id: sessionProfileId }
        });
        const { data } = response;
        setIsPro(data?.enabled || false);
      }
    } catch {
    } finally {
      setLoadingPro(false);
    }
  };

  useQuery({
    queryKey: ['fetchProEnabled', sessionProfileId || ''],
    queryFn: fetchProEnabled
  });

  return null;
};

export default ProProvider;
