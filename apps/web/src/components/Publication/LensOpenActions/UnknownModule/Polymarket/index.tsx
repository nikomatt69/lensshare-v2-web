import { FC, useState } from 'react';
import { ClockIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { Button, Card, Input, Modal, Tooltip } from '@lensshare/ui';
import dayjs from 'dayjs';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';
import { MirrorablePublication, UnknownOpenActionModuleSettings } from '@lensshare/lens';
interface PolymarketEditorProps {
  module: UnknownOpenActionModuleSettings;
  publication?: MirrorablePublication;
}
const PolymarketEditor: FC<PolymarketEditorProps> = () => {
  const { marketConfig, setMarketConfig, resetMarketConfig, setShowMarketEditor } = usePublicationStore();
  const [showEndTimeModal, setShowEndTimeModal] = useState(false);

  return (
    <Card className="m-5 px-5 py-3" forceRounded>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <PlusIcon className="h-4 w-4" />
          <b>Market</b>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            icon={<ClockIcon className="h-4 w-4" />}
            onClick={() => setShowEndTimeModal(true)}
            outline
            size="sm"
          >
            End Time: {dayjs(marketConfig.endTime).format('MMM D, YYYY')}
          </Button>
          <Modal
            icon={<ClockIcon className="h-5 w-5" />}
            onClose={() => setShowEndTimeModal(false)}
            show={showEndTimeModal}
            title="Set Market End Time"
          >
            <div className="p-5">
              <Input
                label="End Time"
                type="datetime-local"
                onChange={(e) =>
                  setMarketConfig({
                    ...marketConfig,
                    endTime: e.target.valueAsNumber
                  })
                }
                value={dayjs(marketConfig.endTime).toISOString().slice(0, 16)}
              />
              <div className="mt-5 flex space-x-2">
                <Button
                  className="ml-auto"
                  onClick={() => setShowEndTimeModal(false)}
                  outline
                  variant="danger"
                >
                  Cancel
                </Button>
                <Button
                  className="ml-auto"
                  onClick={() => setShowEndTimeModal(false)}
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
                resetMarketConfig();
                setShowMarketEditor(false);
              }}
              type="button"
            >
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <Input
          label="Market Question"
          onChange={(e) => setMarketConfig({...marketConfig, question: e.target.value})}
          value={marketConfig.question}
          placeholder="Enter the market question"
        />
        {marketConfig.outcomes.map((outcome, index) => (
          <div className="flex items-center space-x-2 text-sm" key={index}>
            <Input
              iconRight={
                index > 1 ? (
                  <button
                    className="flex"
                    onClick={() => {
                      const newOutcomes = [...marketConfig.outcomes];
                      newOutcomes.splice(index, 1);
                      setMarketConfig({ ...marketConfig, outcomes: newOutcomes });
                    }}
                    type="button"
                  >
                    <XMarkIcon className="h-5 w-5 text-red-500" />
                  </button>
                ) : null
              }
              onChange={(event) => {
                const newOutcomes = [...marketConfig.outcomes];
                newOutcomes[index] = event.target.value;
                setMarketConfig({ ...marketConfig, outcomes: newOutcomes });
              }}
              placeholder={`Outcome ${index + 1}`}
              value={outcome}
            />
          </div>
        ))}
        {marketConfig.outcomes.length < 10 ? (
          <button
            className="mt-2 flex items-center space-x-2 text-sm"
            onClick={() => {
              const newOutcomes = [...marketConfig.outcomes];
              newOutcomes.push('');
              setMarketConfig({ ...marketConfig, outcomes: newOutcomes });
            }}
            type="button"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add another outcome</span>
          </button>
        ) : null}
      </div>
    </Card>
  );
};

export default PolymarketEditor;