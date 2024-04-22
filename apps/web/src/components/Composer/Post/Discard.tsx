import { Alert } from '@lensshare/ui';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';


interface DiscardProps {
  onDiscard: () => void;
}

const Discard: FC<DiscardProps> = ({ onDiscard }) => {
  const {showDiscardModal ,setShowDiscardModal} = useGlobalModalStateStore(
    
  );



  return (
    <Alert
      isDestructive
      show={showDiscardModal}
      title="Discard Post"
      description="This can’t be undone and you’ll lose your draft."
      onClose={() => setShowDiscardModal(false)}
      confirmText="Discard"
      onConfirm={onDiscard}
    />
  );
};

export default Discard;
