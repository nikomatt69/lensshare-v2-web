import { ClockIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Bars3BottomLeftIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Button, Card, Input, Modal, Tooltip } from '@lensshare/ui';
import plur from 'plur';
import type { FC } from 'react';
import { useState } from 'react';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';

const PollEditor: FC = () => {
  const { pollConfig, resetPollConfig, setPollConfig, setShowPollEditor } =
    usePublicationStore();
  const [showPollLengthModal, setShowPollLengthModal] = useState(false);

  return (
    <Card className="m-5 px-5 py-3" forceRounded>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <Bars3BottomLeftIcon className="h-4 w-4" />
          <b>Poll</b>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            icon={<ClockIcon className="h-4 w-4" />}
            onClick={() => setShowPollLengthModal(true)}
            outline
            size="sm"
          >
            {pollConfig.length} {plur('day', pollConfig.length)}
          </Button>
          <Modal
            icon={<ClockIcon className="h-5 w-5" />}
            onClose={() => setShowPollLengthModal(false)}
            show={showPollLengthModal}
            title="Poll length"
          >
            <div className="p-5">
              <Input
                label="Poll length (days)"
                max={30}
                min={1}
                onChange={(e) =>
                  setPollConfig({
                    ...pollConfig,
                    length: Number(e.target.value)
                  })
                }
                type="number"
                value={pollConfig.length}
              />
              <div className="mt-5 flex space-x-2">
                <Button
                  className="ml-auto"
                  onClick={() => {
                    setPollConfig({ ...pollConfig, length: 7 });
                    setShowPollLengthModal(false);
                  }}
                  outline
                  variant="danger"
                >
                  Cancel
                </Button>
                <Button
                  className="ml-auto"
                  onClick={() => setShowPollLengthModal(false)}
                >
                  Save
                </Button>
              </div>
            </div>
          </Modal>
          <Tooltip content="Delete" placement="top">
            <button
              className="flex"
              onClick={() => {
                resetPollConfig();
                setShowPollEditor(false);
              }}
              type="button"
            >
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {pollConfig.options.map((choice, index) => (
          <div className="flex items-center space-x-2 text-sm" key={index}>
            <Input
              iconRight={
                index > 1 ? (
                  <button
                    className="flex"
                    onClick={() => {
                      const newOptions = [...pollConfig.options];
                      newOptions.splice(index, 1);
                      setPollConfig({ ...pollConfig, options: newOptions });
                    }}
                    type="button"
                  >
                    <XMarkIcon className="h-5 w-5 text-red-500" />
                  </button>
                ) : null
              }
              onChange={(event) => {
                const newOptions = [...pollConfig.options];
                newOptions[index] = event.target.value;
                setPollConfig({ ...pollConfig, options: newOptions });
              }}
              placeholder={`Choice ${index + 1}`}
              value={choice}
            />
          </div>
        ))}
        {pollConfig.options.length !== 10 ? (
          <button
            className="mt-2 flex items-center space-x-2 text-sm"
            onClick={() => {
              const newOptions = [...pollConfig.options];
              newOptions.push('');
              setPollConfig({ ...pollConfig, options: newOptions });
            }}
            type="button"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add another option</span>
          </button>
        ) : null}
      </div>
    </Card>
  );
};

export default PollEditor;
