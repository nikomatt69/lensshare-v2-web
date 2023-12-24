import type { FC } from 'react';

import { formatDate } from '@lib/formatTime';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import type { StatsType } from './LeafwatchStats';
import { BRAND_COLOR } from '@lensshare/data/constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface ImpressionsTodayProps {
  impressionsToday: StatsType['impressionsToday'];
}

const ImpressionsToday: FC<ImpressionsTodayProps> = ({ impressionsToday }) => {
  return (
    <div>
      <div>
        <div className="divider" />
        <div className="p-5 text-lg font-bold">Impressions Today</div>
        <div className="divider" />
        <div className="p-5">
          <Line
            data={{
              datasets: [
                {
                  backgroundColor: '#fff0f2',
                  borderColor: BRAND_COLOR,
                  data: impressionsToday.map((impression) => impression.count),
                  fill: true,
                  label: 'Impressions'
                }
              ],
              labels: impressionsToday.map((impression) =>
                formatDate(new Date(impression.timestamp), 'hh:mm')
              )
            }}
            options={{
              plugins: {
                legend: { display: false },
                title: { display: false }
              },
              responsive: true
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImpressionsToday;
