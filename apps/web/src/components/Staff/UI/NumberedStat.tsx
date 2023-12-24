import humanize from '@lensshare/lib/humanize';
import { Card } from '@lensshare/ui';
import type { FC } from 'react';



interface NumberedStatsProps {
  count: string;
  name: string;
}

const NumberedStat: FC<NumberedStatsProps> = ({ count, name }) => {
  return (
    <Card className="p-5" forceRounded>
      <div>{name}</div>
      <div className="text-xl font-bold tracking-wide">
        {humanize(parseInt(count))}
      </div>
    </Card>
  );
};

export default NumberedStat;
