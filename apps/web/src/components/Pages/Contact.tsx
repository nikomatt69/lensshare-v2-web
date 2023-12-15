import MetaTags from '@components/Common/MetaTags';
import SettingsHelper from '@components/Shared/SettingsHelper';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { APP_NAME, FRESHDESK_WORKER_URL } from '@lensshare/data/constants';
import { Errors } from '@lensshare/data/errors';
import { PAGEVIEW } from '@lensshare/data/tracking';
import {
  Button,
  Card,
  EmptyState,
  Form,
  GridItemEight,
  GridItemFour,
  GridLayout,
  Input,
  Select,
  Spinner,
  TextArea,
  useZodForm
} from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/useAppStore';
import { useEffectOnce } from 'usehooks-ts';
import { object, string } from 'zod';

const newContactSchema = object({
  email: string().email({ message: 'Email is not valid' }),
  category: string(),
  subject: string()
    .min(1, { message: 'Subject should not be empty' })
    .max(260, { message: 'Subject should not exceed 260 characters' }),
  message: string()
    .min(1, { message: 'Message should not be empty' })
    .max(1000, { message: 'Message should not exceed 1000 characters' })
});

const Contact: FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);

  const form = useZodForm({
    schema: newContactSchema
  });


  const submitToFreshdesk = async (
    email: string,
    category: string,
    subject: string,
    body: string
  ) => {
    setSubmitting(true);
    try {
      const { data } = await axios.post(FRESHDESK_WORKER_URL, {
        email,
        profile: currentProfile
          ? {
              id: currentProfile?.id,
              handle: currentProfile?.handle || ''
            }
          : null,
        category,
        subject,
        body
      });

      if (data.success) {
        setSubmitted(true);
      } else {
        toast.error(data?.message ?? Errors.SomethingWentWrong);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GridLayout>
      <MetaTags title={`Contact • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsHelper
          heading={`Contact • ${APP_NAME}`} 
          description="Contact us to help you get the issue resolved."
        />
      </GridItemFour>
      <GridItemEight>
        <Card>
          {submitted ? (
            <EmptyState
              message="Your message has been sent!"
              icon={<CheckCircleIcon className="h-14 w-14 text-green-500" />}
              hideCard
            />
          ) : (
            <Form
              form={form}
              className="space-y-4 p-5"
              onSubmit={({ email, category, subject, message }) =>
                submitToFreshdesk(email, category, subject, message)
              }
            >
              <Input
                label="Email"
                placeholder="gavin@hooli.com"
                {...form.register('email')}
              />
              <Select
                label="Category"
                values={[
                  'Support',
                  'Bug report',
                  'Feature request',
                  'Report copyright infringement',
                  'Other'
                ]}
                {...form.register('category')}
              />
              <Input
                label="Subject"
                placeholder="What happened?"
                {...form.register('subject')}
              />
              <TextArea
                label="Message"
                placeholder="How can we help?"
                {...form.register('message')}
              />
              <div className="ml-auto">
                <Button
                  type="submit"
                  disabled={submitting}
                  icon={
                    submitting ? (
                      <Spinner size="xs" />
                    ) : (
                      <PencilSquareIcon className="h-5 w-5" />
                    )
                  }
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Contact;
