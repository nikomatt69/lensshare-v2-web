import { Button } from '@lensshare/ui';
import { type FC } from 'react';
import { useOpenActionStore } from 'src/store/non-persisted/useOpenActionStore';


interface SaveOrCancelProps {
  onSave: () => void;
  saveDisabled?: boolean;
}

const SaveOrCancel: FC<SaveOrCancelProps> = ({
  onSave,
  saveDisabled = false
}) => {
  const { reset, setShowModal } = useOpenActionStore();

  return (
    <div className="mt-5 flex space-x-2">
      <Button
        className="ml-auto"
        onClick={() => {
          reset();
          setShowModal(false);
        }}
        outline
        variant="danger"
      >
        Cancel
      </Button>
      <Button disabled={saveDisabled} onClick={onSave}>
        Save
      </Button>
    </div>
  );
};

export default SaveOrCancel;
