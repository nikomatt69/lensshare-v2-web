import { useHidePublicationMutation } from '@lensshare/lens';
import { Alert } from '@lensshare/ui';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

const DeletePublication: FC = () => {
  const {
    showPublicationDeleteAlert,
    deletingPublication,
    setShowPublicationDeleteAlert
  } = useGlobalAlertStateStore();

  const [hidePost, { loading }] = useHidePublicationMutation({
    onCompleted: () => {
      setShowPublicationDeleteAlert(false, null);

      toast.success('Publication deleted successfully');
    },
    update: (cache) => {
      cache.evict({
        id: `${deletingPublication?.__typename}:${deletingPublication?.id}`
      });
    }
  });

  return (
    <Alert
      title="Delete Publication?"
      description="This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results."
      confirmText="Delete"
      show={showPublicationDeleteAlert}
      isDestructive
      isPerformingAction={loading}
      onConfirm={() =>
        hidePost({
          variables: { request: { for: deletingPublication?.id } }
        })
      }
      onClose={() => setShowPublicationDeleteAlert(false, null)}
    />
  );
};

export default DeletePublication;
