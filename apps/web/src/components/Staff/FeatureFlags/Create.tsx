import type { Feature } from '@lensshare/types/hey';
import type { FC } from 'react';

import { HEY_API_URL } from '@lensshare/data/constants';
import { STAFFTOOLS } from '@lensshare/data/tracking';
import { Button, Form, Input, useZodForm } from '@lensshare/ui';

import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { object, string } from 'zod';
import getAuthApiHeaders from '@components/Shared/Oembed/Portal/getAuthApiHeaders main';

const createFeatureSchema = object({
  key: string().min(1, { message: 'Key is required' })
});

interface CreateProps {
  features: Feature[];
  setFeatures: (flags: any) => void;
  setShowCreateModal: (show: boolean) => void;
}

const Create: FC<CreateProps> = ({
  features,
  setFeatures,
  setShowCreateModal
}) => {
  const [creating, setCreating] = useState(false);

  const form = useZodForm({
    schema: createFeatureSchema
  });

  const create = (key: string) => {
    setCreating(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/features/create`,
        { key },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: () => {
          setCreating(false);
          return 'Failed to create feature flag';
        },
        loading: 'Creating feature flag...',
        success: ({ data }) => {
          
          setFeatures([...features, data.feature]);
          setCreating(false);
          setShowCreateModal(false);
          return 'Feature flag created';
        }
      }
    );
  };

  return (
    <Form
      className="m-5 space-y-4"
      form={form}
      onSubmit={async ({ key }) => {
        await create(key);
      }}
    >
      <Input
        className="text-sm"
        placeholder="Key"
        type="text"
        {...form.register('key')}
      />
      <Button disabled={creating} type="submit">
        Create
      </Button>
    </Form>
  );
};

export default Create;
