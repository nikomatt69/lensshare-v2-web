import { BASE_URL, LENSSHARE_API_URL } from '@lensshare/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';

const FeaturedGroupsProvider: FC = () => {
  const setFeaturedGroups = useAppStore((state) => state.setFeaturedGroups);

  const fetchFeaturedGroups = async () => {
    try {
      const response = await axios.get(`${LENSSHARE_API_URL}/group/featured`);
      const { data } = response;
      setFeaturedGroups(data.result || []);
    } catch {}
  };

  useQuery({
    queryKey: ['fetchFeaturedGroups'],
    queryFn: fetchFeaturedGroups
  });

  return null;
};

export default FeaturedGroupsProvider;
