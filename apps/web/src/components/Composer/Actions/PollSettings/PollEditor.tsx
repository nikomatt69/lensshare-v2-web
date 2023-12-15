import { ClockIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Bars3BottomLeftIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Button, Card, Input, Modal, Tooltip } from '@lensshare/ui';
import plur from 'plur';
import type { FC } from 'react';
import { useState } from 'react';
import { usePublicationStore } from 'src/store/usePublicationStore';

const PollEditor: FC = () => {
  const setShowPollEditor = usePublicationStore(
    (state) => state.setShowPollEditor
  );
  const pollConfig = usePublicationStore((state) => state.pollConfig);
  const setPollConfig = usePublicationStore((state) => state.setPollConfig);
  const resetPollConfig = usePublicationStore((state) => state.resetPollConfig);
  const [showPollLengthModal, setShowPollLengthModal] = useState(false);

  return (
    <Card className="m-5 px-5 py-3" forceRounded>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <Bars3BottomLeftIcon className="text-brand h-4 w-4" />
          <b>Poll</b>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="sm"
            icon={<ClockIcon className="h-4 w-4" />}
            onClick={() => setShowPollLengthModal(true)}
            outline
          >
            {pollConfig.length} {plur('day', pollConfig.length)}
          </Button>
          <Modal
            title="Poll length"
            icon={<ClockIcon className="text-brand h-5 w-5" />}
            show={showPollLengthModal}
            onClose={() => setShowPollLengthModal(false)}
          >
            <div className="p-5">
              <Input
                label="Poll length (days)"
                type="number"
                value={pollConfig.length}
                min={1}
                max={30}
                onChange={(e) =>
                  setPollConfig({
                    ...pollConfig,
                    length: Number(e.target.value)
                  })
                }
              />
              <div className="flex space-x-2 pt-5">
                <Button
                  className="ml-auto"
                  variant="danger"
                  onClick={() => {
                    setPollConfig({ ...pollConfig, length: 7 });
                    setShowPollLengthModal(false);
                  }}
                  outline
                >
                  Cancel
                </Button>
                <Button
                  className="ml-auto"
                  variant="primary"
                  onClick={() => setShowPollLengthModal(false)}
                >
                  Save
                </Button>
              </div>
            </div>
          </Modal>
          <Tooltip placement="top" content="Delete">
            <button
              className="flex"
              onClick={() => {
                resetPollConfig();
                setShowPollEditor(false);
              }}
            >
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {pollConfig.choices.map((choice, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <Input
              placeholder={`Choice ${index + 1}`}
              value={choice}
              onChange={(event) => {
                const newChoices = [...pollConfig.choices];
                newChoices[index] = event.target.value;
                setPollConfig({ ...pollConfig, choices: newChoices });
              }}
              iconRight={
                index > 1 ? (
                  <button
                    className="flex"
                    onClick={() => {
                      const newChoices = [...pollConfig.choices];
                      newChoices.splice(index, 1);
                      setPollConfig({ ...pollConfig, choices: newChoices });
                    }}
                  >
                    <XMarkIcon className="h-5 w-5 text-red-500" />
                  </button>
                ) : null
              }
            />
          </div>
        ))}
        {pollConfig.choices.length !== 10 ? (
          <button
            className="text-brand mt-2 flex items-center space-x-2 text-sm"
            onClick={() => {
              const newChoices = [...pollConfig.choices];
              newChoices.push('');
              setPollConfig({ ...pollConfig, choices: newChoices });
            }}
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
