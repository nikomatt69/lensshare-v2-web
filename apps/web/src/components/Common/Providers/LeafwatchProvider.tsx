import { type FC } from 'react';
import { useLeafwatchStore } from 'src/store/persisted/useLeafwatchStore';
import { useLeafwatchPersistStore } from 'src/store/useLeafwatchPersistStore';
import { useEffectOnce } from 'usehooks-ts';
import { v4 as uuid } from 'uuid';
const LeafwatchProvider: FC = () => {
  const { anonymousId, setAnonymousId } = useLeafwatchPersistStore();

  useEffectOnce(() => {
    if (!anonymousId) {
      setAnonymousId(uuid());
    }
  });

  return null;
};

export default LeafwatchProvider;
