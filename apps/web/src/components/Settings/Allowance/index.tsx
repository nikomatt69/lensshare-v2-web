import MetaTags from '@components/Common/MetaTags';
import Loader from '@components/Shared/Loader';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME, DEFAULT_COLLECT_TOKEN } from '@lensshare/data/constants';
import { PAGEVIEW } from '@lensshare/data/tracking';

import { Card, GridItemEight, GridItemFour, GridLayout, TabButton } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useState } from 'react';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/persisted/useAppStore';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import Allowance from './Allowance';
import CollectModules from './CollectModules';
import OpenActions from './OpenActions';

enum Type {
  COLLECT_MODULES = 'COLLECT_MODULES',
  OPEN_ACTIONS = 'OPEN_ACTIONS'
}

const AllowanceSettings: NextPage = () => {
  const { currentProfile } = useAppStore();
  const [type, setType] = useState<Type>(Type.COLLECT_MODULES);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'allowance' });
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Allowance settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <TabButton
              active={type === Type.COLLECT_MODULES}
              name="Collect & Follow Modules"
              onClick={() => setType(Type.COLLECT_MODULES)}
              showOnSm
            />
            <TabButton
              active={type === Type.OPEN_ACTIONS}
              name="Open Actions"
              onClick={() => setType(Type.OPEN_ACTIONS)}
              showOnSm
            />
          </div>
          {type === Type.COLLECT_MODULES && <CollectModules />}
          {type === Type.OPEN_ACTIONS && <OpenActions />}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default AllowanceSettings;
