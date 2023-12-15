import { BanknotesIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { GARDENER } from '@lensshare/data/tracking';
import type { AnyPublication, ReportPublicationRequest } from '@lensshare/lens';
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
import { useGlobalAlertStateStore } from 'src/store/useGlobalAlertStateStore';

interface ModActionProps {
  publication: AnyPublication;
  className?: string;
}

const ModAction: FC<ModActionProps> = ({ publication, className = '' }) => {
  const setShowModActionAlert = useGlobalAlertStateStore(
    (state) => state.setShowModActionAlert
  );
  const [createReport, { loading }] = useReportPublicationMutation();

  const reportPublication = async ({
    type,
    subreason
  }: {
    type: string;
    subreason: string;
  }) => {
    // Variables
    const request: ReportPublicationRequest = {
      for: publication?.id,
      reason: {
        [type]: {
          reason: type.replace('Reason', '').toUpperCase(),
          subreason
        }
      }
    };

    return await createReport({
      variables: { request },
      onCompleted: () => {
        setShowModActionAlert(false, null);
      }
    });
  };

  interface ReportButtonProps {
    config: {
      type: string;
      subreason: string;
    }[];
    icon: ReactNode;
    label: string;
  }

  const ReportButton: FC<ReportButtonProps> = ({ config, icon, label }) => (
    <Button
      disabled={loading}
      variant="warning"
      size="sm"
      outline
      icon={icon}
      onClick={() => {
        toast.promise(
          Promise.all(
            config.map(async ({ type, subreason }) => {
              await reportPublication({ type, subreason });

            })
          ),
          {
            loading: 'Reporting publication...',
            success: 'Publication reported successfully',
            error: 'Error reporting publication'
          }
        );
      }}
    >
      {label}
    </Button>
  );

  return (
    <span
      className={cn('flex flex-wrap items-center gap-3 text-sm', className)}
      onClick={stopEventPropagation}
      aria-hidden="true"
    >
      <ReportButton
        config={[
          {
            type: 'spamReason',
            subreason: PublicationReportingSpamSubreason.FakeEngagement
          }
        ]}
        icon={<DocumentTextIcon className="h-4 w-4" />}
        label="Poor content"
      />
      <ReportButton
        config={[
          {
            type: 'spamReason',
            subreason: PublicationReportingSpamSubreason.LowSignal
          }
        ]}
        icon={<BanknotesIcon className="h-4 w-4" />}
        label="Stop Sponsor"
      />
      <ReportButton
        config={[
          {
            type: 'spamReason',
            subreason: PublicationReportingSpamSubreason.FakeEngagement
          },
          {
            type: 'spamReason',
            subreason: PublicationReportingSpamSubreason.LowSignal
          }
        ]}
        icon={<BanknotesIcon className="h-4 w-4" />}
        label="Poor content & Stop Sponsor"
      />
    </span>
  );
};

export default ModAction;
