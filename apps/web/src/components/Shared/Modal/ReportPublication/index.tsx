import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { PAGEVIEW, PUBLICATION } from '@lensshare/data/tracking';
import type { AnyPublication } from '@lensshare/lens';
import { useReportPublicationMutation } from '@lensshare/lens';
import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import {
  Button,
  EmptyState,
  ErrorMessage,
  Form,
  Spinner,
  TextArea,
  useZodForm
} from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';
import { object, string } from 'zod';

import Reason from './Reason';

const newReportPublicationSchema = object({
  additionalComments: string().max(260, {
    message: 'Additional comments should not exceed 260 characters'
  })
});

interface ReportProps {
  publication: AnyPublication | null;
}

const ReportPublication: FC<ReportProps> = ({ publication }) => {
  const [type, setType] = useState('');
  const [subReason, setSubReason] = useState('');



  const [
    createReport,
    { data: submitData, loading: submitLoading, error: submitError }
  ] = useReportPublicationMutation({
  
  });

  const form = useZodForm({
    schema: newReportPublicationSchema
  });

  const reportPublication = (additionalComments: string | null) => {
    createReport({
      variables: {
        request: {
          for: publication?.id,
          reason: {
            [type]: {
              reason: type.replace('Reason', '').toUpperCase(),
              subreason: subReason
            }
          },
          additionalComments
        }
      }
    });
  };

  return (
    <div onClick={stopEventPropagation} aria-hidden="true">
      {submitData?.reportPublication === null ? (
        <EmptyState
          message="Publication reported successfully!"
          icon={<CheckCircleIcon className="h-14 w-14 text-green-500" />}
          hideCard
        />
      ) : publication ? (
        <div className="p-5">
          <Form
            form={form}
            className="space-y-4"
            onSubmit={({ additionalComments }) =>
              reportPublication(additionalComments)
            }
          >
            {submitError ? (
              <ErrorMessage title="Failed to report" error={submitError} />
            ) : null}
            <Reason
              setType={setType}
              setSubReason={setSubReason}
              type={type}
              subReason={subReason}
            />
            {subReason ? (
              <>
                <TextArea
                  label="Description"
                  placeholder="Please provide additional details"
                  {...form.register('additionalComments')}
                />
                <Button
                  className="flex w-full justify-center"
                  type="submit"
                  disabled={submitLoading}
                  icon={
                    submitLoading ? (
                      <Spinner size="xs" />
                    ) : (
                      <PencilSquareIcon className="h-4 w-4" />
                    )
                  }
                >
                  Report
                </Button>
              </>
            ) : null}
          </Form>
        </div>
      ) : null}
    </div>
  );
};

export default ReportPublication;
