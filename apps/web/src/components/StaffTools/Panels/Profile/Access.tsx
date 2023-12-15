import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import { IS_MAINNET, PREFERENCES_WORKER_URL } from '@lensshare/data/constants';
import type { Profile } from '@lensshare/lens';
import { Spinner, Toggle } from '@lensshare/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { hydrateAuthTokens } from 'src/store/useAuthPersistStore';

const Wrapper = ({
  children,
  title
}: {
  children: ReactNode;
  title: ReactNode;
}) => (
  <span className="flex items-center space-x-2 text-sm">
    <span>{children}</span>
    <span>{title}</span>
  </span>
);

enum Type {
  VERIFIED = 'VERIFIED',
  STAFF = 'STAFF',
  GARDENER = 'GARDENER',
  TUSTED_MEMBER = 'TUSTED_MEMBER'
}

type AccessType = keyof typeof Type;

interface RankProps {
  profile: Profile;
}

const Access: FC<RankProps> = ({ profile }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isGardener, setIsGardener] = useState(false);

  const getPreferences = async () => {
    try {
      const response = await axios.get(
        `${PREFERENCES_WORKER_URL}/get/${profile.id}`
      );
      const { data } = response;

      setIsVerified(data.result?.is_verified || false);
      setIsStaff(data.result?.is_staff || false);
      setIsGardener(data.result?.is_gardener || false);

      return data.success;
    } catch (error) {
      return false;
    }
  };

  const { data: preferences } = useQuery({
    queryKey: ['getPreferences', profile.id],
    queryFn: getPreferences,
    enabled: Boolean(profile.id)
  });

  const staffUpdatePreferences = async (type: AccessType) => {
    toast.promise(
      axios.post(
        `${PREFERENCES_WORKER_URL}/update`,
        {
          ...(type === Type.VERIFIED && { isVerified: !isVerified }),
          ...(type === Type.STAFF && { isStaff: !isStaff }),
          ...(type === Type.GARDENER && { isGardener: !isGardener }),

          updateByAdmin: true
        },
        {
          headers: {
            'X-Access-Token': hydrateAuthTokens().accessToken,
            'X-Lens-Network': IS_MAINNET ? 'mainnet' : 'mainnet'
          }
        }
      ),
      {
        loading: 'Updating access...',
        success: () => {
          if (type === Type.VERIFIED) {
            setIsVerified(!isVerified);
          } else if (type === Type.STAFF) {
            setIsStaff(!isStaff);
          } else if (type === Type.GARDENER) {
            setIsGardener(!isGardener);
          }

          return 'Access updated';
        },
        error: 'Error updating access'
      }
    );
  };

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <AdjustmentsVerticalIcon className="h-5 w-5" />
        <div className="text-lg font-bold">Access</div>
      </div>
      <div className="mt-3 space-y-2 font-bold">
        {preferences ? (
          <Wrapper title="Verified member">
            <Toggle
              setOn={() => staffUpdatePreferences(Type.VERIFIED)}
              on={isVerified}
            />
          </Wrapper>
        ) : (
          <Wrapper title="Verified member">
            <Spinner size="xs" />
          </Wrapper>
        )}
        {preferences ? (
          <Wrapper title="Staff member">
            <Toggle
              setOn={() => staffUpdatePreferences(Type.STAFF)}
              on={isStaff}
            />
          </Wrapper>
        ) : (
          <Wrapper title="Staff member">
            <Spinner size="xs" />
          </Wrapper>
        )}
        {preferences ? (
          <Wrapper title="Gardener member">
            <Toggle
              setOn={() => staffUpdatePreferences(Type.GARDENER)}
              on={isGardener}
            />
          </Wrapper>
        ) : (
          <Wrapper title="Gardener member">
            <Spinner size="xs" />
          </Wrapper>
        )}
      </div>
    </>
  );
};

export default Access;
