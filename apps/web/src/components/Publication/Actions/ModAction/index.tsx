import { BanknotesIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { GARDENER } from '@lensshare/data/tracking';
import type { AnyPublication, MirrorablePublication, ReportPublicationRequest } from '@lensshare/lens';
import {
  PublicationReportingSpamSubreason,
  useReportPublicationMutation
} from '@lensshare/lens';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import { Button } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import type { FC, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';
import { useToggle } from 'usehooks-ts';

interface GardenerActionsProps {
  publication: MirrorablePublication;
}

const GardenerActions: FC<GardenerActionsProps> = ({ publication }) => {
  const { setShowGardenerActionsAlert } = useGlobalAlertStateStore();
  const [hasReported, toggletHasReported] = useToggle(
    publication.operations?.hasReported
  );
  const [createReport, { loading }] = useReportPublicationMutation();

  const reportPublication = async ({
    subreason,
    type
  }: {
    subreason: string;
    type: string;
  }) => {
    // Variables
    const request: ReportPublicationRequest = {
      for: publication.id,
      reason: {
        [type]: { reason: type.replace('Reason', '').toUpperCase(), subreason }
      }
    };

    return await createReport({
      onCompleted: () => setShowGardenerActionsAlert(false, null),
      variables: { request }
    });
  };

  interface ReportButtonProps {
    config: { subreason: string; type: string }[];
    icon: ReactNode;
    label: string;
    type: string;
  }

  const ReportButton: FC<ReportButtonProps> = ({
    config,
    icon,
    label,
    type
  }) => (
    <Button
      disabled={loading || hasReported}
      icon={icon}
      onClick={() => {
        Leafwatch.track(GARDENER.REPORT, {
          publication_id: publication.id,
          type
        });

        toast.promise(
          Promise.all(
            config.map(async ({ subreason, type }) => {
              await reportPublication({ subreason, type });
            })
          ),
          {
            error: 'Error reporting publication',
            loading: 'Reporting publication...',
            success: () => {
              toggletHasReported();
              return 'Publication reported successfully';
            }
          }
        );
      }}
      outline
      size="sm"
      variant="warning"
    >
      {label}
    </Button>
  );

  return (
    <span
      className="flex flex-wrap items-center gap-3 text-sm"
      onClick={stopEventPropagation}
    >
      <ReportButton
        config={[
          {
            subreason: PublicationReportingSpamSubreason.LowSignal,
            type: 'spamReason'
          }
        ]}
        icon={<DocumentTextIcon className="h-4 w-4" />}
        label="Spam"
        type="spam"
      />
      <ReportButton
        config={[
          {
            subreason: PublicationReportingSpamSubreason.FakeEngagement,
            type: 'spamReason'
          }
        ]}
        icon={<BanknotesIcon className="h-4 w-4" />}
        label="Un-sponsor"
        type="un-sponsor"
      />
      <ReportButton
        config={[
          {
            subreason: PublicationReportingSpamSubreason.FakeEngagement,
            type: 'spamReason'
          },
          {
            subreason: PublicationReportingSpamSubreason.LowSignal,
            type: 'spamReason'
          }
        ]}
        icon={<BanknotesIcon className="h-4 w-4" />}
        label="Both"
        type="both"
      />
     
    </span>
  );
};

export default GardenerActions;