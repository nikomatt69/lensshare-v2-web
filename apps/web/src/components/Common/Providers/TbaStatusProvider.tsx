import type { FC } from 'react';


import { useQuery } from '@tanstack/react-query';
import {useAppStore} from 'src/store/useAppStore';
import { useTbaStatusStore } from 'src/store/useTbaStatusStore';
import getTbaStatus from '@lib/api/getTbaStatus';

const TbaStatusProvider: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setIsTba = useTbaStatusStore((state) => state.setIsTba);

  useQuery({
    queryFn: () =>
      getTbaStatus(currentProfile?.ownedBy.address, (deployed) =>
        setIsTba(deployed)
      ),
    queryKey: ['getTbaStatus', currentProfile?.ownedBy.address]
  });

  return null;
};

export default TbaStatusProvider;
