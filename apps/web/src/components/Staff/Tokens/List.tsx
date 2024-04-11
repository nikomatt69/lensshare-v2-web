import type { AllowedToken } from '@lensshare/types/hey';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@lensshare/data/constants';
import { STAFFTOOLS } from '@lensshare/data/tracking';

import { Button, Card, EmptyState, ErrorMessage, Modal } from '@lensshare/ui';

import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

import Create from './Create';
import getAllTokens from '@lib/api/getAllTokens';
import getAuthApiHeaders from '@components/Shared/Oembed/Portal/getAuthApiHeaders main';

const List: FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tokens, setTokens] = useState<[] | AllowedToken[]>([]);

  const { error, isLoading } = useQuery({
    queryFn: () => getAllTokens((tokens) => setTokens(tokens)),
    queryKey: ['getAllTokens']
  });

  const deleteToken = (id: string) => {
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/tokens/delete`,
        { id },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: 'Failed to delete token',
        loading: 'Deleting token...',
        success: () => {
        
          setTokens(tokens.filter((token) => token.id !== id));
          return 'Token deleted';
        }
      }
    );
  };

  return (
    <Card>
      <div className="flex items-center justify-between space-x-5 p-5">
        <div className="text-lg font-bold">Allowed Tokens</div>
        <Button onClick={() => setShowCreateModal(!showCreateModal)}>
          Create
        </Button>
      </div>
      <div className="divider" />
      <div className="m-5">
        {isLoading ? (
          <Loader  message="Loading tokens..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load tokens" />
        ) : !tokens.length ? (
          <EmptyState
            hideCard
            icon={<CurrencyDollarIcon className="h-8 w-8" />}
            message={<span>No tokens found</span>}
          />
        ) : (
          <div className="space-y-6">
            {tokens?.map((token) => (
              <div className="flex items-center justify-between" key={token.id}>
                <div>
                  <b>{token.name}</b> ({token.symbol})
                  <div className="mt-2 text-sm">
                    <span className="ld-text-gray-500">Decimals: </span>
                    {token.decimals}
                  </div>
                  <div className="text-sm">
                    <span className="ld-text-gray-500">Contract: </span>
                    {token.contractAddress}
                  </div>
                </div>
                <Button
                  onClick={() => deleteToken(token.id)}
                  outline
                  size="sm"
                  variant="danger"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        onClose={() => setShowCreateModal(!showCreateModal)}
        show={showCreateModal}
        title="Create token"
      >
        <Create
          setShowCreateModal={setShowCreateModal}
          setTokens={setTokens}
          tokens={tokens}
        />
      </Modal>
    </Card>
  );
};

export default List;
