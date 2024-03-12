import type { OpenAction } from '@lensshare/data/enums';
import type { FC, ReactNode } from 'react';

import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { Card } from '@lensshare/ui';
import { ScreenType, useOpenActionStore } from 'src/store/non-persisted/useOpenActionStore';


interface OpenActionItemProps {
  description: string;
  icon: ReactNode;
  title: string;
  type: OpenAction;
}

const OpenActionItem: FC<OpenActionItemProps> = ({
  description,
  icon,
  title,
  type
}) => {
  const setScreen = useOpenActionStore((state) => state.setScreen);
  const setSelectedOpenAction = useOpenActionStore(
    (state) => state.setSelectedOpenAction
  );

  const onOpenActionSelected = (name: OpenAction) => {
    setScreen(ScreenType.Config);
    setSelectedOpenAction(name);
  };

  return (
    <Card
      className="flex cursor-pointer items-center justify-between px-5 py-3"
      forceRounded
      onClick={() => onOpenActionSelected(type)}
    >
      <div className="flex items-center space-x-3">
        <div className="text-brand-500">{icon}</div>
        <div className="space-y-1">
          <div className="font-bold">{title}</div>
          <div className="text-sm">{description}</div>
        </div>
      </div>
      <ChevronRightIcon className="w-5 h-5 text-gray-400" />
    </Card>
  );
};

export default OpenActionItem;
