import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@lensshare/data/constants';
import { Localstorage } from '@lensshare/data/storage';
import {
  Button,
  Card,
  GridItemEight,
  GridItemFour,
  GridLayout
} from '@lensshare/ui';
import type { NextPage } from 'next';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/useAppStore';

import SettingsSidebar from '../Sidebar';
import { useDisconnectXmtp } from 'src/hooks/useXmtpClient';
import Custom404 from 'src/pages/404';
const CleanupSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const disconnectXmtp = useDisconnectXmtp();

  if (!currentProfile) {
    return <Custom404 />;
  }

  const cleanup = (key: string) => {
    localStorage.removeItem(key);
    toast.success(`Cleared ${key}`);
    disconnectXmtp;
  };

  return (
    <GridLayout>
      <MetaTags title={`Cleanup settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="p-5">
          <div className="space-y-5">
            <div className="text-lg font-bold">Cleanup Localstorage</div>
            <p>
              If you stuck with some issues, you can try to clean up the
              localstorage. This will remove all the data stored in your
              browser.
            </p>
          </div>
          <div className="divider my-5" />
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>Optimistic publications</b>
                <div className="lt-text-gray-500 text-xs font-bold">
                  Clean your posts or comments that are not indexed
                </div>
              </div>
              <Button onClick={() => cleanup(Localstorage.TransactionStore)}>
                Cleanup
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>Timeline settings</b>
                <div className="lt-text-gray-500 text-xs font-bold">
                  Clean your timeline filter settings
                </div>
              </div>
              <Button onClick={() => cleanup(Localstorage.TimelineStore)}>
                Cleanup
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>Direct message keys</b>
                <div className="lt-text-gray-500 text-xs font-bold">
                  Clean your DM encryption key
                </div>
              </div>
              <Button
                onClick={() => {
                  cleanup(Localstorage.MessageStore), disconnectXmtp();
                  toast.success(`Cleared DM keys`);
                }}
              >
                Cleanup
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b>Feature flags cache</b>
                <div className="lt-text-gray-500 text-xs font-bold">
                  Clean your feature flags cache
                </div>
              </div>
              <Button onClick={() => cleanup(Localstorage.FeaturesCache)}>
                Cleanup
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <b className="text-red-500">App settings</b>
                <div className="lt-text-gray-500 text-xs font-bold">
                  Note: Cleaning will log you out
                </div>
              </div>
              <Button onClick={() => cleanup(Localstorage.LensshareStore)}>
                Cleanup
              </Button>
            </div>
          </div>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default CleanupSettings;
